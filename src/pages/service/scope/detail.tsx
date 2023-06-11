import {
  Col,
  Form,
  Row,
  Space,
  Button,
  Input,
  Card,
  Spin,
  Tabs,
  Select,
  InputNumber,
  Typography
} from "antd";
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo
} from "react";
import { useParams, useHistory } from "react-router-dom";
import { BreadcrumbContext } from "@/layouts/BaseLayout";
import { cleanObject, goBackInDetailPage, mappingOptions } from "@/utils";
import { toast } from "react-toastify";
import ServiceService from "@/services/service";
import variables from "@/constants/variables";
import messages from "@/constants/messages";
import ConfirmModal from "@/components/ConfirmModal";
import CustomUpload from "@/components/CustomUpload";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/app/store";
import { serviceActions } from "../service.slice";
import ScopeBackgroundTab from "./ScopeBackgroundTab";

const { TextArea } = Input;
const { Text } = Typography;

const ServiceScopeDetail = () => {
  const serviceService = new ServiceService();
  const auth = useAppSelector((state: RootState) => state.auth);
  const categoryOptions = useAppSelector(
    (state: RootState) => state.service.categoryOptions
  );
  const dispatch = useAppDispatch();
  const [isChange, setIsChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backgrounds, setBackgrounds] = useState<any[]>([]);
  const [logos, setLogos] = useState<any[]>([]);
  const breadcrumb = useContext(BreadcrumbContext);
  const [form] = Form.useForm();
  const [defaultCategory, setDefaultCategory] = useState<any>(null);

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    if (id === "add") {
      breadcrumb.addBreadcrumb("Add");
    } else {
      fetchDetail();
    }
    dispatch(serviceActions.getCategoryOptions());
  }, [dispatch, id]);

  const allCategoryOptions = useMemo(
    () => mappingOptions(categoryOptions.data, "id", "name", [defaultCategory]),
    [categoryOptions.data, defaultCategory]
  );

  const fetchDetail = async () => {
    setLoading(true);
    const res = await serviceService.scope.getScope(id);
    setLoading(false);

    if (res.status === variables.OK) {
      form.setFieldsValue({
        ...res.payload,
        categoryId: res.payload.categoryId.toString()
      });

      if (res.payload.logo) {
        setLogos([
          {
            uid: -1,
            name: "image.jpg",
            status: "done",
            url: res.payload.logo
          }
        ]);
      }
      setDefaultCategory({
        value: res.payload.category.id.toString(),
        label: res.payload.category.name
      });
      setBackgrounds(res.payload.backgrounds);

      breadcrumb.addBreadcrumb(res.payload.name);
    } else {
      switch (res?.status) {
        case variables.NOT_FOUND:
          return toast.error(messages.NOT_FOUND("scope"));
        default:
          return toast.error(messages.GET_DETAIL_FAILED("scope"));
      }
    }
  };

  const create = async data => {
    setLoading(true);
    const res = await serviceService.scope.addScope(data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.CREATE_SUCCESS("scope"));
      history.push("/service/scopes");
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Scope name"));
        default:
          return toast.error(messages.CREATE_FAILED("scope"));
      }
    }
  };

  const update = async data => {
    setLoading(true);
    const res = await serviceService.scope.updateScope(id, data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.EDIT_SUCCESS("scope"));
      breadcrumb.addBreadcrumb(data.name);
      setIsChange(false);
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Scope name"));
        default:
          return toast.error(messages.EDIT_FAILED("scope"));
      }
    }
  };

  const convertData = data => {
    const newData = { ...data };
    const iconUrl = logos.length > 0 ? logos[0].url : "";
    newData.logo = iconUrl;
    newData.backgrounds = backgrounds;
    newData.categoryId = parseInt(data.categoryId);

    return cleanObject(newData);
  };

  const onSave = data => {
    if (logos.length === 0) {
      return toast.error("Please upload a logo image");
    }
    if (backgrounds.length === 0) {
      return toast.error("Please upload at least 1 background image");
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

  const handleLogos = useCallback(newLogos => {
    setLogos(newLogos);
    setIsChange(true);
  }, []);

  const itemsTab = [
    {
      label: "General Information",
      key: "1",
      children: (
        <Row gutter={[64, 16]} className="px-4">
          <Col span={12}>
            <Form.Item
              name="name"
              label="Scope Name"
              rules={[
                {
                  required: true,
                  message: "Scope Name is required"
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="mt-2"
              name="categoryId"
              label="Category"
              rules={[
                {
                  required: true,
                  message: "Category is required"
                }
              ]}
            >
              <Select
                placeholder="Select Category"
                optionFilterProp="label"
                className="w-100"
                options={allCategoryOptions}
                showSearch
              />
            </Form.Item>

            <Form.Item name="description" label="Description" className="mt-2">
              <TextArea rows={5} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="logo"
              label="Logo"
              rules={[
                {
                  required: true,
                  message: "Logo is required"
                }
              ]}
            >
              <CustomUpload fileList={logos} setFileList={handleLogos} />
            </Form.Item>

            <div className="mt-4">
              <Text strong>2D Coordinate (For Minimap)</Text>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name={["coordinate2D", "x"]}
                    label="X"
                    rules={[
                      {
                        required: true,
                        message: "2D Coordinate X is required"
                      }
                    ]}
                  >
                    <InputNumber className="w-100 input-number-custom" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={["coordinate2D", "y"]}
                    label="Y"
                    rules={[
                      {
                        required: true,
                        message: "2D Coordinate Y is required"
                      }
                    ]}
                  >
                    <InputNumber className="w-100 input-number-custom" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div className="mt-4">
              <Text strong>3D Coordinate (For Real World Map)</Text>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item
                    name={["coordinate3D", "x"]}
                    label="X"
                    rules={[
                      {
                        required: true,
                        message: "3D Coordinate X is required"
                      }
                    ]}
                  >
                    <InputNumber className="w-100 input-number-custom" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={["coordinate3D", "y"]}
                    label="Y"
                    rules={[
                      {
                        required: true,
                        message: "3D Coordinate Y is required"
                      }
                    ]}
                  >
                    <InputNumber className="w-100 input-number-custom" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name={["coordinate3D", "z"]}
                    label="Y"
                    rules={[
                      {
                        required: true,
                        message: "3D Coordinate Z is required"
                      }
                    ]}
                  >
                    <InputNumber className="w-100 input-number-custom" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      )
    },
    {
      label: "Backgrounds",
      key: "2",
      children: (
        <ScopeBackgroundTab
          backgrounds={backgrounds}
          setBackgrounds={handleBackgrounds}
          auth={auth}
        />
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
            Back
          </Button>
          {auth.role === "ADMIN" && (
            <Button
              disabled={!isChange}
              className="button"
              type="primary"
              htmlType="submit"
              onClick={() => form.submit()}
            >
              Save
            </Button>
          )}
        </Space>
      </Card>
    </Spin>
  );
};

export default ServiceScopeDetail;
