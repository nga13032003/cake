import React from "react";
import { Typography } from "antd";
import { PhoneOutlined, EnvironmentOutlined, FacebookOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Contact = () => {
  return (
    <>
      <Title level={3}>Thông tin liên hệ</Title>

      <Text>
        <EnvironmentOutlined /> Bánh Kem Hannie – 233/1, Nghĩa Phát, P.6, Tân Bình, TP. Hồ Chí Minh
      </Text>
      <br />

      <Text>
        <PhoneOutlined /> 0901 358 536
      </Text>
      <br />

      <Text>
        <PhoneOutlined /> 0909 427 319 — Nguyễn Hoàng Quỳnh Như
      </Text>
      <br />

      <Text>
        <FacebookOutlined /> Bánh Kem Hannie
      </Text>
    </>
  );
};

export default Contact;
