import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Button,
  Modal,
  Form,
  Input,
  message,
  Row,
  Col,
  Space,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { supabase } from "../../supabaseClient";
import "./product.css";

const { Title } = Typography;

const TruongHop = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  // FETCH
  const fetchItems = async () => {
    let query = supabase.from("TruongHop").select("*");

    if (search.trim() !== "") {
      query = query.ilike("TenTruongHop", `%${search}%`);
    }

    const { data, error } = await query;
    if (error) message.error("Lỗi tải dữ liệu");
    else setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, [search]);

  // ADD / EDIT
  const handleFinish = async (values) => {
    if (editing) {
      const { error } = await supabase
        .from("TruongHop")
        .update({
          TenTruongHop: values.TenTruongHop,
          GhiChu: values.GhiChu,
        })
        .eq("id", editing.id);

      if (!error) message.success("Cập nhật thành công!");
      else message.error("Cập nhật thất bại!");
    } else {
      const { error } = await supabase.from("TruongHop").insert([
        {
          TenTruongHop: values.TenTruongHop,
          GhiChu: values.GhiChu,
        },
      ]);

      if (!error) message.success("Thêm mới thành công!");
      else message.error("Thêm thất bại!");
    }

    form.resetFields();
    setEditing(null);
    setOpen(false);
    fetchItems();
  };

  // DELETE
  const handleDelete = async (id) => {
    const { error } = await supabase.from("TruongHop").delete().eq("id", id);
    if (!error) {
      message.success("Đã xóa!");
      fetchItems();
    } else message.error("Xóa thất bại!");
  };

  // Hàm cắt chữ
  const truncateText = (text, n = 60) => {
    if (!text) return "";
    return text.length > n ? text.slice(0, n) + "..." : text;
  };

  return (
    <>
      {/* HEADER */}
      <div className="product-header">
        <Input
          placeholder="Tìm theo tên..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setOpen(true);
          }}
          className="add-button"
        >
          Thêm mới
        </Button>
      </div>

      {/* GRID */}
      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card className="product-card" hoverable>
              {/* Tên */}
              <Title level={5} className="truncate mb-1">
                {item.TenTruongHop}
              </Title>

              {/* Ghi chú cắt */}
              <p style={{ minHeight: 60 }}>
                {truncateText(item.GhiChu, 60)}
              </p>

              {/* xem thêm */}
              {item.GhiChu?.length > 60 && (
                <Button
                  type="link"
                  style={{ padding: 0 }}
                  onClick={() => {
                    setDetailItem(item);
                    setDetailOpen(true);
                  }}
                >
                  Xem thêm
                </Button>
            
              )}
              <br />
              <Space>
                <Button
                  icon={<EditOutlined />}
                  className="btn-edit"
                  onClick={() => {
                    setEditing(item);
                    form.setFieldsValue({ ...item });
                    setOpen(true);
                  }}
                />

                <Popconfirm
                  title="Bạn chắc muốn xóa?"
                  okText="Xóa"
                  cancelText="Hủy"
                  onConfirm={() => handleDelete(item.id)}
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* MODAL THÊM / SỬA */}
      <Modal
        title={editing ? "Chỉnh sửa trường hợp" : "Thêm trường hợp"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Tên trường hợp"
            name="TenTruongHop"
            rules={[{ required: true, message: "Vui lòng nhập tên trường hợp" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Ghi chú" name="GhiChu">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ✅ MODAL CHI TIẾT */}
      <Modal
        title="Chi tiết"
        open={detailOpen}
        footer={null}
        onCancel={() => setDetailOpen(false)}
      >
        {detailItem && (
          <>
            <Title level={5}>{detailItem.TenTruongHop}</Title>
            <p>{detailItem.GhiChu}</p>
          </>
        )}
      </Modal>
    </>
  );
};

export default TruongHop;
