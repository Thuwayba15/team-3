"use client";

import React from "react";
import { Card, Col, Row, Typography, Form, Input, Button, message } from "antd";
import { motion } from "framer-motion";
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  SendOutlined,
  CustomerServiceOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { useStyles } from "./styles";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function ContactPage() {
  const { styles } = useStyles();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

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

  const contactInfo = [
    {
      icon: <MailOutlined />,
      title: "Email",
      content: "info@ubuntulearn.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: <PhoneOutlined />,
      title: "Phone",
      content: "+27 12 345 6789",
      description: "Mon-Fri, 8am-5pm SAST"
    },
    {
      icon: <EnvironmentOutlined />,
      title: "Office",
      content: "Johannesburg, South Africa",
      description: "Visit us by appointment"
    },
    {
      icon: <ClockCircleOutlined />,
      title: "Support Hours",
      content: "24/7 Online Support",
      description: "Always here to help"
    }
  ];

  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("Thank you for your message. We will get back to you soon.");
      form.resetFields();
    } catch {
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              Contact Us
            </Title>
            <Paragraph className={styles.heroSubtitle}>
              Have questions or need support? We are here to help. Reach out to our team 
              and we will get back to you as soon as possible.
            </Paragraph>
          </div>
        </motion.div>

        {/* Contact Info Grid */}
        <motion.div variants={itemVariants} className={styles.section}>
          <Row gutter={[24, 24]} className={styles.contactGrid}>
            {contactInfo.map((info, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={styles.contactCard} hoverable>
                    <div className={styles.contactIcon}>
                      {info.icon}
                    </div>
                    <Title level={4} className={styles.contactTitle}>
                      {info.title}
                    </Title>
                    <Text className={styles.contactContent}>
                      {info.content}
                    </Text>
                    <Text className={styles.contactDescription}>
                      {info.description}
                    </Text>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Contact Form Section */}
        <motion.div variants={itemVariants} className={styles.section}>
          <Card className={styles.formCard}>
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={12}>
                <div className={styles.formContent}>
                  <Title level={2} className={styles.formTitle}>
                    Send us a Message
                  </Title>
                  <Paragraph className={styles.formDescription}>
                    Whether you have a question, feedback, or need assistance with our 
                    platform, do not hesitate to reach out. We value your input and 
                    are committed to providing the best support experience.
                  </Paragraph>
                  
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className={styles.contactForm}
                  >
                    <Form.Item
                      name="name"
                      label="Your Name"
                      rules={[{ required: true, message: "Please enter your name" }]}
                    >
                      <Input
                        prefix={<CustomerServiceOutlined />}
                        placeholder="Enter your full name"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      label="Email Address"
                      rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Please enter a valid email" }
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="your.email@example.com"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="subject"
                      label="Subject"
                      rules={[{ required: true, message: "Please enter a subject" }]}
                    >
                      <Input
                        placeholder="What is your message about?"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="message"
                      label="Message"
                      rules={[{ required: true, message: "Please enter your message" }]}
                    >
                      <TextArea
                        rows={4}
                        placeholder="Tell us more about your question or feedback..."
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        size="large"
                        icon={<SendOutlined />}
                        className={styles.submitButton}
                      >
                        Send Message
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </Col>

              <Col xs={24} lg={12}>
                <div className={styles.faqContent}>
                  <Title level={2} className={styles.faqTitle}>
                    Frequently Asked Questions
                  </Title>
                  
                  <div className={styles.faqList}>
                    <div className={styles.faqItem}>
                      <Title level={5} className={styles.faqQuestion}>
                        How do I create an account?
                      </Title>
                      <Paragraph className={styles.faqAnswer}>
                        Click the Get Started button on our homepage and follow the 
                        registration process. It only takes a few minutes!
                      </Paragraph>
                    </div>

                    <div className={styles.faqItem}>
                      <Title level={5} className={styles.faqQuestion}>
                        What courses do you offer?
                      </Title>
                      <Paragraph className={styles.faqAnswer}>
                        We offer a comprehensive curriculum covering various subjects 
                        for different grade levels, with personalized learning paths.
                      </Paragraph>
                    </div>

                    <div className={styles.faqItem}>
                      <Title level={5} className={styles.faqQuestion}>
                        How can parents track progress?
                      </Title>
                      <Paragraph className={styles.faqAnswer}>
                        Parents get access to a dashboard where they can monitor their 
                        child&apos;s progress, view reports, and communicate with educators.
                      </Paragraph>
                    </div>

                    <div className={styles.faqItem}>
                      <Title level={5} className={styles.faqQuestion}>
                        Is technical support available?
                      </Title>
                      <Paragraph className={styles.faqAnswer}>
                        Yes! We offer 24/7 online support through email, chat, and phone 
                        to help with any technical issues.
                      </Paragraph>
                    </div>
                  </div>

                  <div className={styles.ctaSection}>
                    <Paragraph className={styles.ctaText}>
                      Ready to start your learning journey?
                    </Paragraph>
                    <Link href="/register">
                      <Button type="primary" size="large" className={styles.ctaButton}>
                        Get Started Today
                      </Button>
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
