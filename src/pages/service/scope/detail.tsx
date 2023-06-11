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
      breadcrumb.addBreadcrumb("Thêm mới");
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
            name: "Xem hình ảnh",
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
          return toast.error(messages.NOT_FOUND("đối tượng"));
        default:
          return toast.error(messages.GET_DETAIL_FAILED("đối tượng"));
      }
    }
  };

  const create = async data => {
    setLoading(true);
    const res = await serviceService.scope.addScope(data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.CREATE_SUCCESS("đối tượng"));
      history.push("/service/scopes");
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Tên đối tượng"));
        default:
          return toast.error(messages.CREATE_FAILED("đối tượng"));
      }
    }
  };

  const update = async data => {
    setLoading(true);
    const res = await serviceService.scope.updateScope(id, data);
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success(messages.EDIT_SUCCESS("đối tượng"));
      breadcrumb.addBreadcrumb(data.name);
      setIsChange(false);
    } else {
      switch (res?.status) {
        case variables.DUPLICATE_ENTITY:
          return toast.error(messages.EXISTED("Tên đối tượng"));
        default:
          return toast.error(messages.EDIT_FAILED("đối tượng"));
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
      return toast.error("Hình ảnh logo là bắt buộc");
    }
    if (backgrounds.length === 0) {
      return toast.error("Vui lòng thêm ít nhất một hình ảnh nền");
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
      label: "Thông tin chung",
      key: "1",
      children: (
        <Row gutter={[64, 16]} className="px-4">
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên đối tượng"
              rules={[
                {
                  required: true,
                  message: "Tên đối tượng là bắt buộc"
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="mt-2"
              name="categoryId"
              label="Phân loại"
              rules={[
                {
                  required: true,
                  message: "Phân loại là bắt buộc"
                }
              ]}
            >
              <Select
                placeholder="Chọn phân loại"
                optionFilterProp="label"
                className="w-100"
                options={allCategoryOptions}
              />
            </Form.Item>

            <Form.Item name="description" label="Mô tả" className="mt-2">
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
                  message: "Logo là bắt buộc"
                }
              ]}
            >
              <CustomUpload fileList={logos} setFileList={handleLogos} />
            </Form.Item>

            <div className="mt-4">
              <Text strong>Tọa độ 2D (Cho bản đồ thu nhỏ)</Text>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    name={["coordinate2D", "x"]}
                    label="X"
                    rules={[
                      {
                        required: true,
                        message: "Tọa độ 2D X là bắt buộc"
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
                        message: "Tọa độ 2D Y là bắt buộc"
                      }
                    ]}
                  >
                    <InputNumber className="w-100 input-number-custom" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div className="mt-4">
              <Text strong>Tọa độ 3D (Cho bản đồ trường đại học)</Text>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item
                    name={["coordinate3D", "x"]}
                    label="X"
                    rules={[
                      {
                        required: true,
                        message: "Tọa độ 3D X là bắt buộc"
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
                        message: "Tọa độ 3D Y là bắt buộc"
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
                        message: "Tọa độ 3D Z là bắt buộc"
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
      label: "Hình nền",
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

export default ServiceScopeDetail;
