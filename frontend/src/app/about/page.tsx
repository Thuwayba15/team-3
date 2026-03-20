"use client";

import React from "react";
import { Card, Col, Row, Typography, Space } from "antd";
import { motion } from "framer-motion";
import { 
  TeamOutlined, 
  BookOutlined, 
  GlobalOutlined, 
  HeartOutlined,
  BulbOutlined,
  RocketOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { useStyles } from "./styles";

const { Title, Paragraph } = Typography;

export default function AboutPage() {
  const { styles } = useStyles();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const values = [
    {
      icon: <HeartOutlined />,
      title: "Ubuntu Philosophy",
      description: "We believe in the power of community and shared knowledge. 'I am because we are' guides our approach to education."
    },
    {
      icon: <BookOutlined />,
      title: "Excellence in Learning",
      description: "Providing high-quality, accessible education that empowers students to reach their full potential."
    },
    {
      icon: <GlobalOutlined />,
      title: "Global Perspective",
      description: "Connecting learners across diverse cultures and backgrounds to foster understanding and collaboration."
    },
    {
      icon: <BulbOutlined />,
      title: "Innovation",
      description: "Embracing cutting-edge technology and teaching methods to make learning engaging and effective."
    },
    {
      icon: <TeamOutlined />,
      title: "Collaboration",
      description: "Building strong partnerships between students, educators, parents, and communities."
    },
    {
      icon: <RocketOutlined />,
      title: "Growth Mindset",
      description: "Encouraging continuous learning and personal development for all members of our community."
    }
  ];

  return (
    <div className={styles.container}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={styles.content}
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className={styles.heroSection}>
          <div className={styles.heroContent}>
            <Title level={1} className={styles.heroTitle}>
              About UbuntuLearn
            </Title>
            <Paragraph className={styles.heroSubtitle}>
              Empowering education through community, innovation, and excellence.
              We are dedicated to transforming the learning experience for students, 
              educators, and families worldwide.
            </Paragraph>
          </div>
        </motion.div>

        {/* Mission Section */}
        <motion.div variants={itemVariants} className={styles.section}>
          <Card className={styles.missionCard}>
            <Title level={2} className={styles.sectionTitle}>
              Our Mission
            </Title>
            <Paragraph className={styles.missionText}>
              UbuntuLearn is committed to creating an inclusive, innovative, and 
              supportive educational environment where every learner can thrive. 
              We integrate technology with proven teaching methodologies to deliver 
              personalized learning experiences that inspire curiosity and foster 
              academic excellence.
            </Paragraph>
          </Card>
        </motion.div>

        {/* Values Grid */}
        <motion.div variants={itemVariants} className={styles.section}>
          <Title level={2} className={styles.sectionTitle}>
            Our Core Values
          </Title>
          <Row gutter={[24, 24]} className={styles.valuesGrid}>
            {values.map((value, index) => (
              <Col xs={24} md={12} lg={8} key={index}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={styles.valueCard} hoverable>
                    <div className={styles.valueIcon}>
                      {value.icon}
                    </div>
                    <Title level={4} className={styles.valueTitle}>
                      {value.title}
                    </Title>
                    <Paragraph className={styles.valueDescription}>
                      {value.description}
                    </Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants} className={styles.ctaSection}>
          <Card className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <Title level={2} className={styles.ctaTitle}>
                Join Our Learning Community
              </Title>
              <Paragraph className={styles.ctaText}>
                Ready to embark on an educational journey that transforms lives? 
                Discover how UbuntuLearn can make a difference in your learning experience.
              </Paragraph>
              <Space size="large">
                <Link href="/register">
                  <motion.button
                    className={styles.ctaButton}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </Link>
                <Link href="/contact">
                  <motion.button
                    className={styles.ctaButtonSecondary}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Us
                  </motion.button>
                </Link>
              </Space>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
