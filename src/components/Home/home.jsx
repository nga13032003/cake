// src/components/Home/Home.jsx
import React from "react";
import { Layout, Typography, Menu } from "antd";
import { logo } from "../../assets";
import { Link, Outlet } from "react-router-dom";
import {
  PhoneOutlined,
  BankOutlined,
  AppstoreOutlined,
  BookOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import "./Home.css";

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

        <Menu
          mode="horizontal"
          style={{ marginLeft: "auto", minWidth: 500 }}
          items={[
            {
              key: "products",
              icon: <AppstoreOutlined />,
              label: <Link to="/products">Sản phẩm</Link>,
            },
            {
              key: "accessories",
              icon: <GiftOutlined />,
              label: <Link to="/phukien">Phụ kiện</Link>,
            },
            {
              key: "notes",
              icon: <BookOutlined />,
              label: <Link to="/truonghop">Ghi chú</Link>,
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
