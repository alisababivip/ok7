"use client";
import React, { useState, useEffect } from 'react';
import { Button, Table, Card, Space, message, Modal, Form, Input, Switch, Select } from 'antd';
import { SyncOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import promotionService from '../../api/services/promotion.service';
import promotionScraper from '../../utils/promotionScraper';
import { Promotion, CreatePromotionDto } from '../../interface/promotion.interface';

const { TextArea } = Input;
const { Option } = Select;

export default function PromotionManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [form] = Form.useForm();

  // Lấy danh sách khuyến mãi
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await promotionService.getPromotions();
      setPromotions(response.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách khuyến mãi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Đồng bộ dữ liệu từ website bên ngoài
  const syncExternalData = async () => {
    try {
      setSyncLoading(true);
      const result = await promotionService.syncExternalPromotions();
      message.success(`Đã đồng bộ thành công ${result.count} khuyến mãi`);
      await fetchPromotions(); // Refresh data
    } catch (error) {
      message.error('Lỗi khi đồng bộ dữ liệu từ website');
      console.error(error);
    } finally {
      setSyncLoading(false);
    }
  };

  // Tạo dữ liệu mẫu
  const generateSampleData = () => {
    const sampleData = promotionScraper.generateSampleData();
    const sqlQuery = promotionScraper.generateInsertSQL(sampleData);
    
    Modal.info({
      title: 'SQL Query để insert dữ liệu mẫu',
      content: (
        <div>
          <p>Copy đoạn SQL này và chạy trong database:</p>
          <TextArea 
            value={sqlQuery} 
            rows={10} 
            readOnly 
            style={{ marginTop: 10 }}
          />
        </div>
      ),
      width: 800,
    });
  };

  // Hiển thị hướng dẫn scraping
  const showScrapingInstructions = () => {
    const instructions = promotionScraper.getScrapingInstructions();
    
    Modal.info({
      title: 'Hướng dẫn lấy dữ liệu từ 789be89.com',
      content: (
        <div>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            fontSize: '12px',
            backgroundColor: '#f6f8fa',
            padding: '16px',
            borderRadius: '6px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {instructions}
          </pre>
        </div>
      ),
      width: 1000,
    });
  };

  // Xử lý submit form
  const handleSubmit = async (values: CreatePromotionDto) => {
    try {
      if (editingPromotion) {
        await promotionService.updatePromotion({ ...values, id: editingPromotion.id });
        message.success('Cập nhật khuyến mãi thành công');
      } else {
        await promotionService.createPromotion(values);
        message.success('Tạo khuyến mãi thành công');
      }
      
      setModalVisible(false);
      setEditingPromotion(null);
      form.resetFields();
      await fetchPromotions();
    } catch (error) {
      message.error('Lỗi khi lưu khuyến mãi');
      console.error(error);
    }
  };

  // Xóa khuyến mãi
  const handleDelete = async (id: number) => {
    try {
      await promotionService.deletePromotion(id);
      message.success('Xóa khuyến mãi thành công');
      await fetchPromotions();
    } catch (error) {
      message.error('Lỗi khi xóa khuyến mãi');
      console.error(error);
    }
  };

  // Mở modal chỉnh sửa
  const openEditModal = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    form.setFieldsValue(promotion);
    setModalVisible(true);
  };

  // Cấu hình cột bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 100,
      render: (url: string) => (
        <img src={url} alt="thumbnail" style={{ width: 60, height: 40, objectFit: 'cover' }} />
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: 300,
    },
    {
      title: 'Yêu cầu đăng ký',
      dataIndex: 'isRegister',
      key: 'isRegister',
      width: 120,
      render: (isRegister: boolean) => (
        <span style={{ color: isRegister ? 'green' : 'red' }}>
          {isRegister ? 'Có' : 'Không'}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <span style={{ 
          color: status === 'active' ? 'green' : status === 'pending' ? 'orange' : 'red' 
        }}>
          {status === 'active' ? 'Hoạt động' : status === 'pending' ? 'Chờ duyệt' : 'Tạm dừng'}
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record: Promotion) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => openEditModal(record)}
          />
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Quản lý khuyến mãi" style={{ marginBottom: '24px' }}>
        <Space style={{ marginBottom: '16px' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingPromotion(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Thêm khuyến mãi
          </Button>
          
          <Button 
            icon={<SyncOutlined />}
            loading={syncLoading}
            onClick={syncExternalData}
          >
            Đồng bộ từ 789be89.com
          </Button>
          
          <Button onClick={showScrapingInstructions}>
            Hướng dẫn Scraping
          </Button>
          
          <Button onClick={generateSampleData}>
            Tạo dữ liệu mẫu
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={promotions}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} khuyến mãi`,
          }}
        />
      </Card>

      {/* Modal thêm/sửa khuyến mãi */}
      <Modal
        title={editingPromotion ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingPromotion(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề khuyến mãi" />
          </Form.Item>

          <Form.Item
            name="thumbnail"
            label="URL hình ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea rows={4} placeholder="Nhập nội dung chi tiết khuyến mãi" />
          </Form.Item>

          <Form.Item
            name="isRegister"
            label="Yêu cầu đăng ký"
            valuePropName="checked"
          >
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="active">Hoạt động</Option>
              <Option value="pending">Chờ duyệt</Option>
              <Option value="inactive">Tạm dừng</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingPromotion ? 'Cập nhật' : 'Tạo mới'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}