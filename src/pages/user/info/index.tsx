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
  Typography
} from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import UserService from "@/services/user";
import variables from "@/constants/variables";
import messages from "@/constants/messages";
import CustomUpload from "@/components/CustomUpload";
import ChangePassword from "./ChangePassword";
import ModelViewer from "@/components/ModelViewer";
import ReadyPlayerMe from "@/components/ReadyPlayerMe";

const { Text } = Typography;

const UserProfile = () => {
  const userService = new UserService();
  const [isChange, setIsChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatars, setAvatars] = useState<any[]>([]);
  const [model, setModel] = useState(null);
  const [email, setEmail] = useState("");
  const [showIFrame, setShowIFrame] = useState(false);
  const [form] = Form.useForm();

  const id = localStorage.getItem("user_id") || "";

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    const res = await userService.getUser(id);
    setLoading(false);

    if (res.status === variables.OK) {
      form.setFieldsValue(res.payload);
      setModel(res.payload.model || null);
      setEmail(res.payload.email);
      if (res.payload.avatar) {
        setAvatars([
          {
            uid: -1,
            name: "image.jpg",
            status: "done",
            url: res.payload.avatar
          }
        ]);
      }
    } else {
      switch (res?.status) {
        case variables.NOT_FOUND:
          return toast.error(messages.NOT_FOUND("user"));
        default:
          return toast.error(messages.GET_DETAIL_FAILED("user"));
      }
    }
  };

  const convertData = data => {
    const newData = {
      ...data,
      avatar: avatars[0]?.url || null,
      model: model || null
    };
    return newData;
  };

  const onSave = async data => {
    setLoading(true);
    const res = await userService.updateProfile(convertData(data));
    setLoading(false);
    if (res.status === variables.OK) {
      toast.success("Update profile successfully!");
      setIsChange(false);
    } else {
      toast.error("Update profile failed!");
    }
  };

  const handleAvatars = useCallback(newAvatars => {
    setAvatars(newAvatars);
    setIsChange(true);
  }, []);

  const handleModel = useCallback(newModel => {
    setModel(newModel);
    setIsChange(true);
  }, []);

  const itemsTab = [
    {
      label: "General Information",
      key: "1",
      children: (
        <>
          <Form
            layout="vertical"
            form={form}
            onValuesChange={() => {
              setIsChange(true);
            }}
            className="d-flex fl-wrap fl-column fl-between"
            name="app"
            onFinish={onSave}
          >
            <Row gutter={[64, 16]} className="px-4">
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!"
                    }
                  ]}
                >
                  <Input disabled />
                </Form.Item>
                <Row gutter={16}>
                  <Col md={12}>
                    <Form.Item
                      className="mt-2"
                      name="firstName"
                      label="First name"
                      rules={[
                        {
                          required: true,
                          message: "Input your first name!"
                        }
                      ]}
                    >
                      <Input placeholder="First name" />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      className="mt-2"
                      name="lastName"
                      label="Last name"
                      rules={[
                        {
                          required: true,
                          message: "Input your last name!"
                        }
                      ]}
                    >
                      <Input placeholder="Last name" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="mobileNumber"
                  label="Mobile number"
                  className="mt-2"
                >
                  <Input />
                </Form.Item>
                <Form.Item name="avatar" label="Avatar" className="mt-2">
                  <CustomUpload
                    fileList={avatars}
                    setFileList={handleAvatars}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Text
                  style={{
                    fontWeight: "600"
                  }}
                >
                  Model
                </Text>
                {model && (
                  <div
                    style={{
                      border: "2px solid black",
                      borderRadius: "5px",
                      height: "500px"
                    }}
                  >
                    <ModelViewer
                      modelPath={model}
                      position={[0, -3, 0]}
                      scale={3.5}
                      width={540}
                      height={496}
                      key={model}
                      style={{
                        margin: "0 auto"
                      }}
                    />
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  <Button
                    className="mt-2"
                    type="primary"
                    onClick={() => setShowIFrame(true)}
                  >
                    {model ? "Update Avatar Model" : "Create Avatar Model"}
                  </Button>
                </div>
                <ReadyPlayerMe
                  showIFrame={showIFrame}
                  setShowIFrame={setShowIFrame}
                  setModel={handleModel}
                />
              </Col>
            </Row>
          </Form>
          <Space
            style={{
              marginTop: "40px",
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            <Button
              disabled={!isChange}
              className="button"
              type="primary"
              htmlType="submit"
              onClick={() => form.submit()}
            >
              Save
            </Button>
          </Space>
        </>
      )
    },
    {
      label: "Change Password",
      key: "2",
      children: (
        <ChangePassword
          email={email}
          loading={loading}
          setLoading={setLoading}
        />
      )
    }
  ];

  return (
    <Spin size="large" style={{ position: "unset" }} spinning={loading}>
      <Card className="m-2 radius-lg mh-card-detail p-relative detail">
        <Tabs defaultActiveKey="1" className="tab-detail" items={itemsTab} />
      </Card>
    </Spin>
  );
};

export default UserProfile;
