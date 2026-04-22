import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Modal, Form, Tag, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Employee, EmployeeStatus } from '../../models/employee';
import { EmployeeService } from '../../services/employeeService';
const { Title } = Typography;

const EmployeePage: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setData(EmployeeService.getAll());
  }, []);

  // 1. Mở Modal Thêm mới (Tự động sinh mã)
  const showModal = (record?: Employee) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue(record);
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ id: 'NV' + Math.floor(Math.random() * 10000).toString().padStart(4, '0') });
    }
    setIsModalOpen(true);
  };

  // 2. Lưu dữ liệu
  const handleSave = async () => {
    const values = await form.validateFields();
    EmployeeService.save(values);
    message.success(editingId ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
    setIsModalOpen(false);
    setData(EmployeeService.getAll());
  };

  // 3. Xóa nhân viên có điều kiện
  const handleDelete = (record: Employee) => {
    if (record.status !== EmployeeStatus.PROBATION && record.status !== EmployeeStatus.RESIGNED) {
      message.error('Chỉ được xóa nhân viên Thử việc hoặc Đã thôi việc!');
      return;
    }
    Modal.confirm({
      title: 'Cảnh báo xóa',
      content: `Bạn có chắc muốn xóa nhân viên ${record.fullName}?`,
      okText: 'Xóa', okType: 'danger', cancelText: 'Hủy',
      onOk: () => {
        EmployeeService.delete(record.id);
        setData(EmployeeService.getAll());
        message.success('Đã xóa nhân viên');
      }
    });
  };

  const columns = [
    { title: 'Mã NV', dataIndex: 'id', key: 'id' },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { 
      title: 'Chức vụ', dataIndex: 'position', key: 'position',
      filters: [{ text: 'Giám đốc', value: 'Giám đốc' }, { text: 'Trưởng phòng', value: 'Trưởng phòng' }, { text: 'Nhân viên', value: 'Nhân viên' }],
      onFilter: (value: any, record: any) => record.position === value,
    },
    { title: 'Phòng ban', dataIndex: 'department', key: 'department', filters: [
    { text: 'Kế toán', value: 'Kế toán' },
    { text: 'Nhân sự', value: 'Nhân sự' },
    { text: 'Kỹ thuật', value: 'Kỹ thuật' },
    { text: 'Kinh doanh', value: 'Kinh doanh' },
  ],
  onFilter: (value: any, record: Employee) => record.department === value,},
    { 
      title: 'Lương', dataIndex: 'salary', key: 'salary',
      sorter: (a: any, b: any) => b.salary - a.salary, // Giảm dần
      render: (val: number) => val.toLocaleString() + ' đ'
    },
    { 
  title: 'Trạng thái', 
  dataIndex: 'status', 
  key: 'status',
  render: (status: EmployeeStatus) => {
    let color = 'default';
    let text = status;

    // Gán màu sắc tương ứng với từng enum trạng thái
    switch (status) {
      case EmployeeStatus.PROBATION:
        color = 'blue'; // Màu xanh dương cho thử việc
        break;
      case EmployeeStatus.CONTRACTED:
        color = 'green'; // Màu xanh lá cho đã ký hợp đồng
        break;
      case EmployeeStatus.ON_LEAVE:
        color = 'orange'; // Màu cam cho nghỉ phép
        break;
      case EmployeeStatus.RESIGNED:
        color = 'red'; // Màu đỏ cho đã thôi việc
        break;
      default:
        color = 'default';
    }

    return (
      <Tag color={color} key={status} style={{ fontWeight: '500' }}>
        {text.toUpperCase()}
      </Tag>
    );
  }
},
    {
      title: 'Hành động', key: 'action',
      render: (_: any, record: Employee) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>QUẢN LÝ NHÂN VIÊN</Title>
      
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>Thêm mới</Button>
        <Input 
          placeholder="Tìm theo mã hoặc họ tên..." 
          prefix={<SearchOutlined />} 
          onChange={e => setSearchText(e.target.value)}
        />
      </Space>

      <Table 
        dataSource={data.filter(item => item.fullName.toLowerCase().includes(searchText.toLowerCase()) || item.id.includes(searchText))}
        columns={columns}
        rowKey="id"
      />

      <Modal 
        title={editingId ? "Chỉnh sửa nhân viên" : "Thêm mới nhân viên"}
        visible={isModalOpen} onOk={handleSave} onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" label="Mã nhân viên" rules={[{ required: true }]}><Input disabled /></Form.Item>
          <Form.Item 
            name="fullName" label="Họ tên" 
            rules={[
              { required: true, message: 'Không để trống' },
              { max: 50, message: 'Tối đa 50 ký tự' },
              { pattern: /^[a-zA-ZÀ-ỹ\s]+$/, message: 'Không chứa ký tự đặc biệt' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Chức vụ" rules={[{ required: true }]}>
            <Select options={[{ value: 'Giám đốc' }, { value: 'Trưởng phòng' }, { value: 'Nhân viên' }]} />
          </Form.Item>
          <Form.Item name="department" label="Phòng ban" rules={[{ required: true }]}>
            <Select options={[{ value: 'Kế toán' }, { value: 'Nhân sự' }, { value: 'Kỹ thuật' }]} />
          </Form.Item>
          <Form.Item name="salary" label="Lương" rules={[{ required: true }]}><Input type="number" /></Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select options={Object.values(EmployeeStatus).map(s => ({ value: s, label: s }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeePage;