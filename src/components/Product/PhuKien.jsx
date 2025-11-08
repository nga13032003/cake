import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  message,
  Row,
  Col,
  Space,
  Popconfirm,
  Image,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { supabase } from "../../supabaseClient";
import "./product.css";

const { Title } = Typography;

const PhuKien = () => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const BUCKET = "product";

  const fetchItems = async () => {
    let query = supabase.from("PhuKien").select("*");
    if (search.trim() !== "") query = query.ilike("TenPhuKien", `%${search}%`);
    const { data, error } = await query;
    if (error) message.error("Lỗi tải phụ kiện");
    else setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, [search]);

  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(fileName, file);
    if (error) {
      message.error("Upload ảnh thất bại!");
      return null;
    }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleFinish = async (values) => {
    let imageUrl = editing?.HinhAnh ?? null;
    if (imageFile) imageUrl = await uploadImage(imageFile);

    if (editing) {
      const { error } = await supabase
        .from("PhuKien")
        .update({
          TenPhuKien: values.TenPhuKien,
          Gia: values.Gia,
          HinhAnh: imageUrl,
        })
        .eq("id", editing.id);

      if (!error) message.success("Cập nhật thành công!");
      else message.error("Cập nhật thất bại!");
    } else {
      const { error } = await supabase.from("PhuKien").insert([
        {
          TenPhuKien: values.TenPhuKien,
          Gia: values.Gia,
          HinhAnh: imageUrl,
        },
      ]);

      if (!error) message.success("Thêm mới thành công!");
      else message.error("Thêm thất bại!");
    }

    form.resetFields();
    setImageFile(null);
    setEditing(null);
    setOpen(false);
    fetchItems();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("PhuKien").delete().eq("id", id);
    if (!error) {
      message.success("Đã xóa!");
      fetchItems();
    } else message.error("Xóa thất bại!");
  };

  const uploadProps = {
    beforeUpload: (file) => {
      setImageFile(file);
      return false;
    },
    fileList: imageFile ? [imageFile] : [],
    onRemove: () => setImageFile(null),
  };

  return (
    <>
      <div className="product-header">
        <Input
          placeholder="Tìm theo tên phụ kiện..."
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
            setImageFile(null);
            setOpen(true);
          }}
          className="add-button"
        >
          Thêm mới
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              className="product-card"
              hoverable
              cover={
                <Image
                  alt={item.TenPhuKien}
                  src={item.HinhAnh || "https://via.placeholder.com/300x200?text=No+Image"}
                  height={220}
                  className="card-img"
                />
              }
            >
              <Title level={5} className="truncate mb-1">
                {item.TenPhuKien}
              </Title>

              <p className="font-bold text-red-600 mb-3">{item.Gia?.toLocaleString()} VND</p>

              <Space>
                <Button
                  icon={<EditOutlined />}
                  className="btn-edit"
                  onClick={() => {
                    setEditing(item);
                    setImageFile(null);
                    form.setFieldsValue({ ...item });
                    setOpen(true);
                  }}
                />

                {item.HinhAnh && (
                  <a href={item.HinhAnh} download target="_blank" rel="noopener noreferrer">
                    <Button icon={<DownloadOutlined />} />
                  </a>
                )}

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

      <Modal
        title={editing ? "Chỉnh sửa phụ kiện" : "Thêm phụ kiện"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          setImageFile(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Tên phụ kiện"
            name="TenPhuKien"
            rules={[{ required: true, message: "Vui lòng nhập tên phụ kiện" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="Gia"
            rules={[{ required: true, message: "Vui lòng nhập giá" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item label="Hình ảnh">
            <Upload {...uploadProps} maxCount={1} listType="picture">
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>

            {editing?.HinhAnh && !imageFile && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={editing.HinhAnh}
                  alt="Current"
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 4 }}
                />
                <span style={{ marginLeft: 8, color: "#888" }}>Ảnh hiện tại</span>
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PhuKien;