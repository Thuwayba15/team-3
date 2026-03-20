"use client";

import { Card, Col, Row, Skeleton } from "antd";

interface IDashboardPageSkeletonProps {
    cardCount?: number;
}

/** Generic dashboard page skeleton used by admin and student pages while loading data. */
export function DashboardPageSkeleton({ cardCount = 3 }: IDashboardPageSkeletonProps) {
    return (
        <div>
            <Skeleton active paragraph={{ rows: 1 }} title={{ width: "30%" }} />

            <Row gutter={[16, 16]}>
                {Array.from({ length: cardCount }).map((_, index) => (
                    <Col key={index} xs={24} md={12} lg={8}>
                        <Card>
                            <Skeleton active paragraph={{ rows: 2 }} title={false} />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card>
                <Skeleton active paragraph={{ rows: 6 }} title={false} />
            </Card>
        </div>
    );
}
