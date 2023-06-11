import { Col, Form, Row, Space, Button, Input, Card, Spin, Tabs } from "antd";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { BreadcrumbContext } from "@/layouts/BaseLayout";
import { cleanObject, goBackInDetailPage } from "@/utils";
import { toast } from "react-toastify";
import ServiceService from "@/services/service";
import variables from "@/constants/variables";
import messages from "@/constants/messages";
import ConfirmModal from "@/components/ConfirmModal";
import CustomUpload from "@/components/CustomUpload";
import { useAppSelector } from "@/hooks";
import { RootState } from "@/app/store";

const { TextArea } = Input;

const ServiceCategoryDetail = () => {
  const serviceService = new ServiceService();
  const auth = useAppSelector((state: RootState) => state.auth);
  const [isChange, setIsChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backgrounds, setBackgrounds] = useState<any[]>([]);
  const breadcrumb = useContext(BreadcrumbContext);
  const [form] = Form.useForm();

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    if (id === "add") {
      breadcrumb.addBreadcrumb("Thêm mới");
    } else {
      fetchDetail();
    }
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    const res = await serviceService.category.getCategory(id);
    setLoading(false);

    if (res.status === variables.OK) {
      form.setFieldsValue(res.payload);
      if (res.payload.background) {
        setBackgrounds([
          {
            uid: -1,
            name: "Xem hình ảnh",
            status: "done",
            url: res.payload.background
          }
        ]);
      }
      breadcrumb.addBreadcrumb(res.payload.name);
    } else {
      switch (res?.status) {
        case variables.NOT_FOUND:
          return toast.error(messages.NOT_FOUND("phân loại"));
        default:
          return toast.error(messages.GET_DETAIL_FAILED("phân loại"));
      }
    }
  };

  const create = async data => {
    setLoading(true);
    const res = await serviceService.category.addCategory(data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.CREATE_SUCCESS("phân loại"));
      history.push("/service/categories");
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Tên phân loại"));
        default:
          return toast.error(messages.CREATE_FAILED("phân loại"));
      }
    }
  };

  const update = async data => {
    setLoading(true);
    const res = await serviceService.category.updateCategory(id, data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.EDIT_SUCCESS("phân loại"));
      breadcrumb.addBreadcrumb(data.name);
      setIsChange(false);
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Tên phân loại"));
        default:
          return toast.error(messages.EDIT_FAILED("phân loại"));
      }
    }
  };

  const convertData = data => {
    const newData = { ...data };
    const iconUrl = backgrounds.length > 0 ? backgrounds[0].url : "";
    newData.background = iconUrl;

    return cleanObject(newData);
  };

  const onSave = data => {
    if (backgrounds.length === 0) {
      return toast.error("Vui lòng thêm ảnh nền");
    }
    const newData = convertData(data);
    if (id === "add") {
      create(newData);
    } else {
      update(newData);
    }
  };

  const onCancel = () => {
    if (!isChange) {
      return goBackInDetailPage(history);
    }
    ConfirmModal({
      title: messages.LEAVE,
      onOk() {
        goBackInDetailPage(history);
      }
    });
  };

  const handleBackgrounds = useCallback(newBackgrounds => {
    setBackgrounds(newBackgrounds);
    setIsChange(true);
  }, []);

  const itemsTab = [
    {
      label: "Thông tin chung",
      key: "1",
      children: (
        <Row gutter={[64, 16]} className="px-4">
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên phân loại"
              rules={[
                {
                  required: true,
                  message: "Tên phân loại là bắt buộc"
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Mô tả" className="mt-2">
              <TextArea rows={5} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="background"
              label="Hình nền"
              rules={[
                {
                  required: true,
                  message: "Hình nền là bắt buộc"
                }
              ]}
            >
              <CustomUpload
                fileList={backgrounds}
                setFileList={handleBackgrounds}
              />
            </Form.Item>
          </Col>
        </Row>
      )
    }
  ];

  return (
    <Spin size="large" style={{ position: "unset" }} spinning={loading}>
      <Card className="m-2 radius-lg mh-card-detail p-relative detail">
        <Form
          layout="vertical"
          form={form}
          onValuesChange={() => {
            setIsChange(true);
          }}
          className="d-flex fl-wrap fl-column fl-between"
          name="app"
          onFinish={onSave}
          disabled={auth.role !== "ADMIN"}
        >
          <Tabs defaultActiveKey="1" className="tab-detail" items={itemsTab} />
        </Form>
        <Space className="text-right mt-auto btn-action">
          <Button className="button" onClick={onCancel} htmlType="button">
            Quay về
          </Button>
          {auth.role === "ADMIN" && (
            <Button
              disabled={!isChange}
              className="button"
              type="primary"
              htmlType="submit"
              onClick={() => form.submit()}
            >
              Lưu
            </Button>
          )}
        </Space>
      </Card>
    </Spin>
  );
};

export default ServiceCategoryDetail;
