import React, { memo, useCallback, useState } from "react";
import { Button, Col, Form, Modal, Row, Space, Table, Image } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import messages from "@/constants/messages";
import ConfirmModal from "@/components/ConfirmModal";
import CustomUpload from "@/components/CustomUpload";
import { toast } from "react-toastify";
import "./style.scss";

type Props = {
  backgrounds: string[];
  setBackgrounds: (data: string[]) => void;
  auth: any;
};

const ScopeBackgroundTab = ({ backgrounds, setBackgrounds, auth }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalChange, setIsModalChange] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [page, setPage] = useState(0);
  const size = 10;

  const addBackground = (data: string[]) => {
    const newBackgrounds = backgrounds.concat(data);
    setBackgrounds(newBackgrounds);
    setIsModalVisible(false);
  };

  const onAdd = () => {
    setImages([]);
    setIsModalVisible(true);
    setIsModalChange(false);
    form.resetFields();
  };

  const onDelete = index => {
    const newBackgrounds = [...backgrounds];
    newBackgrounds.splice(index, 1);
    setBackgrounds(newBackgrounds);
    if (index === newBackgrounds.length && index !== 0 && index % size === 0) {
      setPage(index / size - 1);
    }
  };

  const onConfirmRemove = index => {
    ConfirmModal({
      title: messages.CONFIRM_DELETE("hình nền"),
      onOk() {
        onDelete(index);
      }
    });
  };

  const onSave = values => {
    if (images.length === 0) {
      toast.error("Vui lòng đăng tải hình ảnh");
      return;
    }
    const dataImages = images.map(image => image.url);
    addBackground(dataImages);
  };

  const onCancel = () => {
    if (isModalChange) {
      ConfirmModal({
        title: messages.LEAVE,
        onOk() {
          setIsModalVisible(false);
        }
      });
    } else {
      form.resetFields();
      setIsModalVisible(false);
    }
  };

  const handleImages = useCallback(data => {
    setImages(data);
    setIsModalChange(true);
  }, []);

  const columns = [
    {
      title: "STT",
      render: (_, __, index) => page * size + index + 1,
      width: 100
    },
    {
      title: "Hình nền",
      dataIndex: "background",
      render: data => (
        <Image
          className="preview-icon-only"
          height={60}
          width={90}
          src={data}
        />
      ),
      width: 300
    },
    {
      title: "",
      align: "right",
      render: (_, __, index) => (
        <>
          {auth.role === "ADMIN" && (
            <Button
              onClick={() => onConfirmRemove(page * size + index)}
              icon={<DeleteOutlined />}
            ></Button>
          )}
        </>
      )
    }
  ];

  return (
    <div>
      <Row className="mb-2" justify="space-between">
        <Col className="d-flex al-center">
          Tổng cộng: {backgrounds.length} hình nền
        </Col>
        <Col>
          {auth.role === "ADMIN" && (
            <Button type="primary" onClick={onAdd}>
              Thêm mới
            </Button>
          )}
        </Col>
      </Row>
      {backgrounds.length > 0 ? (
        <Table
          columns={columns as any}
          dataSource={backgrounds.map((background, index) => ({
            id: index,
            background
          }))}
          rowKey="id"
          pagination={{
            position: ["bottomCenter"],
            total: backgrounds.length,
            showSizeChanger: false,
            pageSize: size,
            current: page + 1,
            onChange: page => setPage(page - 1)
          }}
        ></Table>
      ) : (
        <div className="text-center m-4">Không hình nền nào được tìm thấy</div>
      )}

      <Modal
        title="Thêm hình nền"
        open={isModalVisible}
        onCancel={onCancel}
        width={700}
        footer={null}
        closable={false}
      >
        <Form
          layout="vertical"
          form={form}
          onValuesChange={() => {
            setIsModalChange(true);
          }}
          className="detail-drole d-flex fl-wrap fl-column fl-between"
          style={{ minHeight: 300 }}
          name="app"
          onFinish={onSave}
          disabled={auth.role !== "ADMIN"}
        >
          <Row gutter={[40, 16]}>
            <Col span={24}>
              <Form.Item
                name="image"
                label={
                  <label className="label-required title-header">
                    Hình ảnh
                  </label>
                }
              >
                <CustomUpload fileList={images} setFileList={handleImages} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Space className="text-right mt-auto btn-action">
          <Button onClick={onCancel} htmlType="button">
            Quay về
          </Button>
          {auth.role === "ADMIN" && (
            <Button
              disabled={!isModalChange}
              type="primary"
              onClick={() => {
                form.submit();
              }}
            >
              Lưu
            </Button>
          )}
        </Space>
      </Modal>
    </div>
  );
};

export default memo(ScopeBackgroundTab);
