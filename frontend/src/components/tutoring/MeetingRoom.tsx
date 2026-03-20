"use client";

import { AudioMutedOutlined, AudioOutlined, PhoneOutlined, VideoCameraAddOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Space, Spin, Typography, message } from "antd";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import type { MeetingAccess } from "@/services/tutoring/tutorService";

const { Paragraph, Text, Title } = Typography;

type LocalMediaMode = "full" | "audio-only" | "none";

interface MeetingRoomProps {
    access: MeetingAccess;
    leaveHref: string;
    autoStart?: boolean;
}

const RTC_CONFIGURATION = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function getHubAbsoluteUrl(hubPath: string): string {
    const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
    return `${baseUrl}${hubPath.startsWith("/") ? hubPath : `/${hubPath}`}`;
}

export function MeetingRoom({ access, leaveHref, autoStart = false }: MeetingRoomProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const hubConnectionRef = useRef<HubConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteStreamRef = useRef<MediaStream | null>(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [isRemoteConnected, setIsRemoteConnected] = useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [hasStartedLive, setHasStartedLive] = useState(autoStart);
    const [localMediaMode, setLocalMediaMode] = useState<LocalMediaMode>("none");
    const [localMediaNoticeKey, setLocalMediaNoticeKey] = useState<string | null>(null);

    const meetingSessionId = access.meetingSessionId;
    const hubUrl = useMemo(() => getHubAbsoluteUrl(access.hubUrl), [access.hubUrl]);
    const hasAudioTrack = !!localStreamRef.current?.getAudioTracks().length;
    const hasVideoTrack = !!localStreamRef.current?.getVideoTracks().length;

    useEffect(() => {
        if (localMediaMode === "full" && localVideoRef.current && localStreamRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
        }
    }, [localMediaMode]);

    useEffect(() => {
        let isCancelled = false;

        const createAndSendOffer = async () => {
            const peerConnection = peerConnectionRef.current;
            const hubConnection = hubConnectionRef.current;
            if (!peerConnection || !hubConnection) {
                return;
            }

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            await hubConnection.invoke("SendOffer", meetingSessionId, offer.sdp ?? "");
            setHasStartedLive(true);
        };

        const acquireLocalStream = async (): Promise<{ stream: MediaStream | null; mode: LocalMediaMode; noticeKey: string | null }> => {
            try {
                return {
                    stream: await navigator.mediaDevices.getUserMedia({ audio: true, video: true }),
                    mode: "full",
                    noticeKey: null,
                };
            } catch {
                try {
                    return {
                        stream: await navigator.mediaDevices.getUserMedia({ audio: true, video: false }),
                        mode: "audio-only",
                        noticeKey: "meeting.messages.joinedAudioOnly",
                    };
                } catch {
                    return {
                        stream: null,
                        mode: "none",
                        noticeKey: "meeting.messages.joinedWithoutMedia",
                    };
                }
            }
        };

        const start = async () => {
            try {
                setIsConnecting(true);
                setConnectionError(null);
                setLocalMediaNoticeKey(null);

                const remoteStream = new MediaStream();
                remoteStreamRef.current = remoteStream;
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream;
                }

                const peerConnection = new RTCPeerConnection(RTC_CONFIGURATION);
                peerConnectionRef.current = peerConnection;

                peerConnection.ontrack = (event) => {
                    event.streams[0]?.getTracks().forEach((track) => remoteStream.addTrack(track));
                    setIsRemoteConnected(true);
                };

                peerConnection.onicecandidate = (event) => {
                    if (!event.candidate || !hubConnectionRef.current) {
                        return;
                    }

                    void hubConnectionRef.current.invoke(
                        "SendIceCandidate",
                        meetingSessionId,
                        event.candidate.candidate,
                        event.candidate.sdpMid ?? "",
                        event.candidate.sdpMLineIndex ?? null,
                    );
                };

                const { stream: localStream, mode, noticeKey } = await acquireLocalStream();
                if (isCancelled) {
                    localStream?.getTracks().forEach((track) => track.stop());
                    return;
                }

                localStreamRef.current = localStream;
                setLocalMediaMode(mode);
                setLocalMediaNoticeKey(noticeKey);
                setIsAudioEnabled(!!localStream?.getAudioTracks().some((track) => track.enabled));
                setIsVideoEnabled(!!localStream?.getVideoTracks().some((track) => track.enabled));

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = localStream ?? null;
                }

                localStream?.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, localStream);
                });

                const hubConnection = new HubConnectionBuilder()
                    .withUrl(hubUrl, { withCredentials: true })
                    .withAutomaticReconnect()
                    .build();

                hubConnection.on("participant-joined", () => {
                    if (access.isTutor) {
                        void createAndSendOffer();
                    }
                    setIsRemoteConnected(true);
                });

                hubConnection.on("participant-left", () => {
                    setIsRemoteConnected(false);
                    if (remoteStreamRef.current) {
                        remoteStreamRef.current.getTracks().forEach((track) => track.stop());
                        remoteStreamRef.current = new MediaStream();
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStreamRef.current;
                        }
                    }
                });

                hubConnection.on("offer", async (sdp: string) => {
                    await peerConnection.setRemoteDescription({ type: "offer", sdp });
                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);
                    await hubConnection.invoke("SendAnswer", meetingSessionId, answer.sdp ?? "");
                    setHasStartedLive(true);
                });

                hubConnection.on("answer", async (sdp: string) => {
                    await peerConnection.setRemoteDescription({ type: "answer", sdp });
                    setHasStartedLive(true);
                });

                hubConnection.on("ice-candidate", async (candidate: string, sdpMid: string, sdpMLineIndex: number | null) => {
                    try {
                        await peerConnection.addIceCandidate({
                            candidate,
                            sdpMid: sdpMid || undefined,
                            sdpMLineIndex: sdpMLineIndex ?? undefined,
                        });
                    } catch {
                        // ignore transient ICE race conditions
                    }
                });

                await hubConnection.start();
                hubConnectionRef.current = hubConnection;

                const participantCount = await hubConnection.invoke<number>("JoinMeeting", meetingSessionId);
                if (access.isTutor && participantCount > 1) {
                    await createAndSendOffer();
                }

                setConnectionError(null);
            } catch (error) {
                setConnectionError(error instanceof Error ? error.message : t("meeting.errors.failedToJoin"));
            } finally {
                if (!isCancelled) {
                    setIsConnecting(false);
                }
            }
        };

        void start();

        return () => {
            isCancelled = true;
            const peerConnection = peerConnectionRef.current;
            const hubConnection = hubConnectionRef.current;
            const localStream = localStreamRef.current;
            const remoteStream = remoteStreamRef.current;

            if (hubConnection) {
                void hubConnection.invoke("LeaveMeeting", meetingSessionId).catch(() => undefined);
                void hubConnection.stop().catch(() => undefined);
            }

            peerConnection?.close();
            localStream?.getTracks().forEach((track) => track.stop());
            remoteStream?.getTracks().forEach((track) => track.stop());
        };
    }, [access.isTutor, hubUrl, meetingSessionId, t]);

    const toggleAudio = () => {
        const stream = localStreamRef.current;
        if (!stream) return;
        const nextValue = !isAudioEnabled;
        stream.getAudioTracks().forEach((track) => {
            track.enabled = nextValue;
        });
        setIsAudioEnabled(nextValue);
    };

    const toggleVideo = () => {
        const stream = localStreamRef.current;
        if (!stream) return;
        const nextValue = !isVideoEnabled;
        stream.getVideoTracks().forEach((track) => {
            track.enabled = nextValue;
        });
        setIsVideoEnabled(nextValue);
    };

    const leaveMeeting = () => {
        message.info(t("meeting.messages.leftMeeting"));
        router.push(leaveHref);
    };

    const renderLocalParticipantBody = () => {
        if (localMediaMode === "full") {
            return <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "100%", borderRadius: 12, background: "#0f172a" }} />;
        }

        return (
            <div
                style={{
                    minHeight: 220,
                    borderRadius: 12,
                    background: "#0f172a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 16,
                    textAlign: "center",
                }}
            >
                <Text style={{ color: "#e2e8f0" }}>
                    {localMediaMode === "audio-only"
                        ? t("meeting.messages.cameraUnavailable")
                        : t("meeting.messages.noCameraOrMicrophone")}
                </Text>
            </div>
        );
    };

    return (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <div>
                <Title level={3} style={{ marginBottom: 4 }}>
                    {access.subjectName}
                </Title>
                <Text type="secondary">
                    {t("meeting.labels.withParticipant", { name: access.otherParticipantName })}
                </Text>
            </div>

            {connectionError ? <Alert type="error" message={connectionError} /> : null}

            {!access.canJoin ? (
                <Alert type="warning" message={t("meeting.messages.meetingNotReady")} />
            ) : null}

            <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
                <Card title={t("meeting.labels.you")}>
                    {renderLocalParticipantBody()}
                    {localMediaNoticeKey ? (
                        <Paragraph type="secondary" style={{ marginTop: 12, marginBottom: 0 }}>
                            {t(localMediaNoticeKey)}
                        </Paragraph>
                    ) : null}
                </Card>

                <Card title={access.otherParticipantName}>
                    <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "100%", borderRadius: 12, background: "#0f172a" }} />
                    {!isRemoteConnected ? (
                        <Paragraph type="secondary" style={{ marginTop: 12, marginBottom: 0 }}>
                            {t("meeting.messages.waitingForParticipant")}
                        </Paragraph>
                    ) : null}
                </Card>
            </div>

            <Card>
                {isConnecting ? (
                    <Space>
                        <Spin size="small" />
                        <Text>{t("meeting.messages.connecting")}</Text>
                    </Space>
                ) : (
                    <Space wrap>
                        <Button disabled={!hasAudioTrack} icon={isAudioEnabled ? <AudioOutlined /> : <AudioMutedOutlined />} onClick={toggleAudio}>
                            {!hasAudioTrack
                                ? t("meeting.actions.audioUnavailable")
                                : isAudioEnabled
                                    ? t("meeting.actions.mute")
                                    : t("meeting.actions.unmute")}
                        </Button>
                        <Button disabled={!hasVideoTrack} icon={isVideoEnabled ? <VideoCameraOutlined /> : <VideoCameraAddOutlined />} onClick={toggleVideo}>
                            {!hasVideoTrack
                                ? t("meeting.actions.videoUnavailable")
                                : isVideoEnabled
                                    ? t("meeting.actions.hideVideo")
                                    : t("meeting.actions.showVideo")}
                        </Button>
                        <Button danger icon={<PhoneOutlined />} onClick={leaveMeeting}>
                            {t("meeting.actions.leave")}
                        </Button>
                    </Space>
                )}
                {hasStartedLive ? (
                    <Paragraph type="secondary" style={{ marginTop: 12, marginBottom: 0 }}>
                        {t("meeting.messages.liveMeeting")}
                    </Paragraph>
                ) : null}
            </Card>
        </Space>
    );
}
