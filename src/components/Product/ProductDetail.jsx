import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Spin, Card, message } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { supabase } from "../../supabaseClient";
import "./productDetail.css";   

const { Title, Paragraph } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("Products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      message.error("Không tìm thấy sản phẩm");
      navigate("/products");
    } else {
      setProduct(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <Spin size="large" />;

  return (
    <div className="detail-wrapper">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/products")}
        className="btn-back"
      >
        Quay lại
      </Button>

      <Card className="detail-card">
        <div className="detail-layout">
          <img
            src={product.HinhAnh}
            alt={product.TenSanPham}
            className="detail-image"
          />

          <div className="detail-info">
            <div>
              <Title level={3} className="detail-title">
                {product.TenSanPham}
              </Title>

              <Title level={4} className="detail-price">
                {product.GIA?.toLocaleString()} VND
              </Title>

              <Paragraph className="detail-desc">
                {product.MoTa || "Không có mô tả"}
              </Paragraph>
            </div>

            <Button
              icon={<EditOutlined />}
              className="btn-edit"
              onClick={() => navigate(`/products/${id}/edit`)}
            >
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetail;
