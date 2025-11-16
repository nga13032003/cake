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
  Select,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  EditOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./product.css";

const { Title } = Typography;
const { Option } = Select;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [openTypeModal, setOpenTypeModal] = useState(false);
  const [form] = Form.useForm();
  const [formType] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("ALL");

  const BUCKET = "product";
  const navigate = useNavigate();

  // ===== FETCH TYPES
  const fetchTypes = async () => {
    const { data, error } = await supabase.from("TypeProducts").select("*").order("id", { ascending: true });
    if (error) {
      message.error("Lỗi tải loại sản phẩm");
    } else {
      setTypes(data || []);
    }
  };

  // ===== FETCH PRODUCTS
  const fetchProducts = async () => {
    // We'll fetch products; filtering by name or type is done client-side for simplicity
    let query = supabase.from("Products").select("*").order("id", { ascending: false });

    const { data, error } = await query;
    if (error) {
      message.error("Lỗi tải sản phẩm");
    } else {
      let list = data || [];

      // Filter by search
      if (search.trim() !== "") {
        const q = search.trim().toLowerCase();
        list = list.filter((p) => (p.TenSanPham || "").toLowerCase().includes(q));
      }

      // Filter by type
      if (selectedTypeFilter !== "ALL") {
        list = list.filter((p) => String(p.IDTypeProducts) === String(selectedTypeFilter));
      }

      setProducts(list);
    }
  };

  useEffect(() => {
    fetchTypes();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch products when search or filter change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedTypeFilter]);

  // ===== Upload ảnh
  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(fileName, file);

    if (error) {
      console.log(error);
      message.error("Upload ảnh thất bại!");
      return null;
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  // ===== ADD / EDIT PRODUCT
  const handleFinish = async (values) => {
    let imageUrl = editingProduct?.HinhAnh ?? null;

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    // Build payload including IDTypeProducts (int8)
    const payload = {
      TenSanPham: values.TenSanPham,
      MoTa: values.MoTa,
      GIA: values.GIA,
      HinhAnh: imageUrl,
      IDTypeProducts: values.IDTypeProducts ?? null,
    };

    if (editingProduct) {
      const { error } = await supabase.from("Products").update(payload).eq("id", editingProduct.id);

      if (!error) message.success("Cập nhật thành công!");
      else message.error("Cập nhật thất bại!");
    } else {
      const { error } = await supabase.from("Products").insert([payload]);

      if (!error) message.success("Thêm thành công!");
      else message.error("Thêm thất bại!");
    }

    form.resetFields();
    setImageFile(null);
    setEditingProduct(null);
    setOpen(false);
    fetchProducts();
  };

  // ===== DELETE PRODUCT
  const handleDelete = async (id) => {
    const { error } = await supabase.from("Products").delete().eq("id", id);

    if (!error) {
      message.success("Đã xóa!");
      fetchProducts();
    } else message.error("Xóa thất bại!");
  };

  // ===== ADD TYPE (TypeProducts)
  const handleAddType = async (values) => {
    const payload = {
      TenLoai: values.TenLoai,
      // bạn có thể thêm created_at nếu muốn: created_at: new Date()
    };

    const { error } = await supabase.from("TypeProducts").insert([payload]);
    if (!error) {
      message.success("Thêm loại thành công!");
      setOpenTypeModal(false);
      formType.resetFields();
      fetchTypes();
    } else {
      message.error("Thêm loại thất bại!");
    }
  };

  // ===== UPLOAD props
  const uploadProps = {
    beforeUpload: (file) => {
      setImageFile(file);
      return false; // prevent auto upload
    },
    fileList: imageFile ? [imageFile] : [],
    onRemove: () => setImageFile(null),
  };

  // Helper: find type name by id
  const getTypeName = (id) => {
    const t = types.find((x) => String(x.id) === String(id));
    return t ? t.TenLoai : "Không có loại";
  };

  return (
    <>
      {/* Header: search + type select + add type + add product */}
      <div className="product-header" style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Input
          placeholder="Tìm theo tên..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          style={{ width: 280 }}
        />

        <Select
          value={selectedTypeFilter}
          onChange={(val) => setSelectedTypeFilter(val)}
          style={{ width: 220 }}
        >
          <Option value="ALL">— Xem tất cả loại —</Option>
          {types.map((t) => (
            <Option key={t.id} value={String(t.id)}>
              {t.TenLoai}
            </Option>
          ))}
        </Select>

        <Button
          onClick={() => setOpenTypeModal(true)}
          icon={<PlusOutlined />}
          type="default"
        >
          Thêm loại
        </Button>

        <div style={{ marginLeft: "auto" }}>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingProduct(null);
              form.resetFields();
              setImageFile(null);
              setOpen(true);
            }}
            className="add-button"
            type="default"
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* GRID */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {products.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              className="product-card"
              hoverable
              cover={
                <Image
                  alt={item.TenSanPham}
                  src={item.HinhAnh || "https://via.placeholder.com/300x200?text=No+Image"}
                  height={220}
                  className="card-img"
                  preview={{
                    mask: <EyeOutlined />,
                  }}
                />
              }
            >
              <Title level={5} className="truncate mb-1">
                {item.TenSanPham}
              </Title>

              <p style={{ fontWeight: 700, color: "#d0021b", marginBottom: 8 }}>
                {item.GIA?.toLocaleString?.()} VND
              </p>

              <p style={{ marginBottom: 12, color: "#666" }}>
                Loại: <strong>{getTypeName(item.IDTypeProducts)}</strong>
              </p>

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
                    setImageFile(null);
                    // map fields into form; ensure IDTypeProducts present
                    form.setFieldsValue({
                      TenSanPham: item.TenSanPham,
                      MoTa: item.MoTa,
                      GIA: item.GIA,
                      IDTypeProducts: item.IDTypeProducts ?? null,
                    });
                    setOpen(true);
                  }}
                />

                {/* DOWNLOAD */}
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

      {/* MODAL ADD / EDIT PRODUCT */}
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
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item label="Loại sản phẩm" name="IDTypeProducts">
            <Select
              placeholder="Chọn loại (hoặc để trống)"
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {types.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.TenLoai}
                </Option>
              ))}
            </Select>
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
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
                <span style={{ marginLeft: 8, color: "#888" }}>Ảnh hiện tại</span>
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL ADD TYPE */}
      <Modal
        title="Thêm loại sản phẩm"
        open={openTypeModal}
        onCancel={() => {
          setOpenTypeModal(false);
          formType.resetFields();
        }}
        onOk={() => formType.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={formType} layout="vertical" onFinish={handleAddType}>
          <Form.Item
            label="Tên loại"
            name="TenLoai"
            rules={[{ required: true, message: "Vui lòng nhập tên loại" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Product;
