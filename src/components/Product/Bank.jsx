import React from "react";
import { Typography, Divider, Image, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { QRaP, QRcN } from "../../assets";

const { Title, Text } = Typography;

const Bank = () => {
  return (
    <>
      <Title level={3}>Thông tin thanh toán</Title>

      {/* === VietinBank === */}
      <div style={{ marginBottom: 24 }}>
        <Text strong>VietinBank</Text>
        <br />
        <Text>STK: 103883498556</Text>
        <br />
        <Text>Chủ TK: PHAM TRUONG HOANG PHUOC</Text>
        <br />

        <div style={{ marginTop: 10 }}>
          <Image
            src={QRaP}
            alt="QR Vietin"
            width={120}
            style={{
              border: "2px solid #d9d9d9",
              borderRadius: 12,
            }}
            preview={{ mask: "Xem chi tiết" }} // click -> phóng to full màn hình
          />

          <br />

          <a href={QRaP} download="QR_VietinBank.png">
            <Button
              type="default"
              icon={<DownloadOutlined />}
              style={{ marginTop: 8 }}
            >
              Tải QR VietinBank
            </Button>
          </a>
        </div>
      </div>

      <Divider />

      {/* === MOMO === */}
      <div style={{ marginBottom: 24 }}>
        <Text strong>MOMO</Text>
        <br />
        <Text>SĐT: 0909 427 319</Text>
        <br />
        <Text>Chủ TK: Nguyễn Hoàng Quỳnh Như</Text>

        <div style={{ marginTop: 10 }}>
          <Image
            src={QRcN}
            alt="QR MOMO"
            width={120}
            style={{
              border: "2px solid #d9d9d9",
              borderRadius: 12,
            }}
            preview={{ mask: "Xem chi tiết" }} // click -> phóng to
          />

          <br />

          <a href={QRcN} download="QR_MoMo.png">
            <Button
              type="default"
              icon={<DownloadOutlined />}
              style={{ marginTop: 8 }}
            >
              Tải QR MOMO
            </Button>
          </a>
        </div>
      </div>

      <Divider />
    </>
  );
};

export default Bank;
