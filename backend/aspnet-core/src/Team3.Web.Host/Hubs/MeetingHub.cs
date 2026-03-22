using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System;
using System.Threading.Tasks;

namespace Team3.Web.Host.Hubs
{
    [Authorize]
    public class MeetingHub : Hub
    {
        private static readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> MeetingMembers = new ConcurrentDictionary<string, ConcurrentDictionary<string, byte>>();

        public async Task<int> JoinMeeting(string meetingSessionId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, meetingSessionId);
            var group = MeetingMembers.GetOrAdd(meetingSessionId, _ => new ConcurrentDictionary<string, byte>());
            group[Context.ConnectionId] = 0;
            await Clients.OthersInGroup(meetingSessionId).SendAsync("participant-joined");
            return group.Count;
        }

        public async Task LeaveMeeting(string meetingSessionId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, meetingSessionId);
            RemoveConnectionFromMeeting(meetingSessionId, Context.ConnectionId);
            await Clients.OthersInGroup(meetingSessionId).SendAsync("participant-left");
        }

        public async Task SendOffer(string meetingSessionId, string sdp)
        {
            await Clients.OthersInGroup(meetingSessionId).SendAsync("offer", sdp);
        }

        public async Task SendAnswer(string meetingSessionId, string sdp)
        {
            await Clients.OthersInGroup(meetingSessionId).SendAsync("answer", sdp);
        }

        public async Task SendIceCandidate(string meetingSessionId, string candidate, string sdpMid, int? sdpMLineIndex)
        {
            await Clients.OthersInGroup(meetingSessionId).SendAsync("ice-candidate", candidate, sdpMid, sdpMLineIndex);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            foreach (var pair in MeetingMembers)
            {
                if (pair.Value.ContainsKey(Context.ConnectionId))
                {
                    RemoveConnectionFromMeeting(pair.Key, Context.ConnectionId);
                    await Clients.OthersInGroup(pair.Key).SendAsync("participant-left");
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        private static void RemoveConnectionFromMeeting(string meetingSessionId, string connectionId)
        {
            ConcurrentDictionary<string, byte> group;
            if (!MeetingMembers.TryGetValue(meetingSessionId, out group))
            {
                return;
            }

            byte _;
            group.TryRemove(connectionId, out _);

            if (group.IsEmpty)
            {
                ConcurrentDictionary<string, byte> __;
                MeetingMembers.TryRemove(meetingSessionId, out __);
            }
        }
    }
}
