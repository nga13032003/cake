// src/pages/Login.jsx
import React, { useState } from "react";
import { Card, Input, Button, Form, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (values) => {
    setLoading(true);
    const { username, password } = values;

    // fake delay để thấy animation loading
    setTimeout(() => {
      if (username === "banhkemhannie" && password === "@Hannie123456") {
        localStorage.setItem("loggedIn", "true"); // lưu trạng thái login
        message.success("Đăng nhập thành công!");
        navigate("/"); // chuyển sang Home
      } else {
        message.error("Sai username hoặc password!");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={2} style={{ textAlign: "center", color: "#000" }}>
          Đăng nhập
        </Title>
        <Form
          name="login_form"
          layout="vertical"
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Vui lòng nhập username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              className="input-animated"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Vui lòng nhập password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              className="input-animated"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="login-button"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
