// src/components/Home/Home.jsx
import React from "react";
import { Layout, Typography, Menu } from "antd";
import { logo } from "../../assets";
import { Link, Outlet } from "react-router-dom";
import {
  PhoneOutlined,
  BankOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const Home = () => {
  return (
    <Layout style={{ background: "#fff", minHeight: "100vh" }}>
      {/* ---------------- HEADER ---------------- */}
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          gap: 18,
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: 54,
            height: 54,
            objectFit: "cover",
            border: "2px solid #d9d9d9",
            borderRadius: 12,
          }}
        />

        <Title level={3} style={{ margin: 0 }}>
          Bánh Kem Hannie
        </Title>

        {/* MENU */}
        <Menu
          mode="horizontal"
          style={{ marginLeft: "auto", minWidth: 400 }}
          items={[
            {
              key: "products",
              icon: <AppstoreOutlined />,
              label: <Link to="/products">Sản phẩm</Link>,
            },
            {
              key: "contact",
              icon: <PhoneOutlined />,
              label: <Link to="/contact">Thông tin liên hệ</Link>,
            },
            {
              key: "bank",
              icon: <BankOutlined />,
              label: <Link to="/bank">Số tài khoản</Link>,
            },
          ]}
        />
      </Header>

      {/* ---------------- CONTENT ---------------- */}
      <Content style={{ padding: 24 }}>
        {/* hiển thị component theo route */}
        <Outlet />
      </Content>

      {/* ---------------- FOOTER ---------------- */}
      <Footer style={{ textAlign: "center", borderTop: "1px solid #eee" }}>
        Bánh Kem Hannie © {new Date().getFullYear()} – Designed by Nga Phan
      </Footer>
    </Layout>
  );
};

export default Home;
