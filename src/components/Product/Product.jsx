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
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./product.css";

const { Title } = Typography;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const BUCKET = "product";
  const navigate = useNavigate();

  // Load product list
  const fetchProducts = async () => {
    let query = supabase.from("Products").select("*");

    if (search.trim() !== "") {
      query = query.ilike("TenSanPham", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      message.error("Lỗi tải sản phẩm");
    } else {
      setProducts(data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  // Upload file to Supabase Storage
  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage.from(BUCKET).upload(fileName, file);

    if (error) {
      console.log(error);
      message.error("Upload ảnh thất bại!");
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  // Xử lý cả Thêm và Sửa
  const handleFinish = async (values) => {
    let imageUrl = editingProduct?.HinhAnh ?? null;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    if (editingProduct) {
      // Cập nhật sản phẩm
      const { error } = await supabase
        .from("Products")
        .update({
          TenSanPham: values.TenSanPham,
          MoTa: values.MoTa,
          GIA: values.GIA,
          HinhAnh: imageUrl,
        })
        .eq("id", editingProduct.id);

      if (error) {
        message.error("Cập nhật thất bại!");
      } else {
        message.success("Cập nhật thành công!");
      }
    } else {
      // Thêm sản phẩm mới
      const { error } = await supabase.from("Products").insert([
        {
          TenSanPham: values.TenSanPham,
          MoTa: values.MoTa,
          GIA: values.GIA,
          HinhAnh: imageUrl,
        },
      ]);

      if (error) {
        message.error("Thêm sản phẩm thất bại!");
      } else {
        message.success("Thêm thành công!");
      }
    }

    // Reset form và đóng modal
    form.resetFields();
    setImageFile(null);
    setEditingProduct(null);
    setOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("Products").delete().eq("id", id);

    if (error) {
      message.error("Xóa thất bại!");
    } else {
      message.success("Đã xóa!");
      fetchProducts();
    }
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
      {/* Header */}
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
            setEditingProduct(null);
            form.resetFields();
            setImageFile(null);
            setOpen(true);
          }}
          className="add-button"
        >
          Thêm mới
        </Button>
      </div>

      {/* GRID */}
      <Row gutter={[16, 16]}>
        {products.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={item.TenSanPham}
                  src={item.HinhAnh || "https://via.placeholder.com/300x200?text=No+Image"}
                  className="w-full h-56 object-cover"
                />
              }
            >
              <Title level={5} className="truncate mb-1">
                {item.TenSanPham}
              </Title>
              <p className="font-bold text-red-600 mb-3">
                {item.GIA?.toLocaleString()} VND
              </p>

              {/* Actions */}
              <Space>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`/products/${item.id}`)}
                  className="btn-detail"
                >
                  Chi tiết
                </Button>

                <Button
                  icon={<EditOutlined />}
                  className="btn-edit"
                  onClick={() => {
                    setEditingProduct(item);
                    setImageFile(null); // Reset ảnh khi sửa
                    form.setFieldsValue({
                      TenSanPham: item.TenSanPham,
                      MoTa: item.MoTa,
                      GIA: item.GIA,
                    });
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

      {/* Modal Thêm / Sửa */}
      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingProduct(null);
          setImageFile(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Tên sản phẩm"
            name="TenSanPham"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả" name="MoTa">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="GIA"
            rules={[{ required: true, message: "Vui lòng nhập giá" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item label="Hình ảnh">
            <Upload {...uploadProps} maxCount={1} listType="picture">
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {editingProduct?.HinhAnh && !imageFile && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={editingProduct.HinhAnh}
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

export default Product;