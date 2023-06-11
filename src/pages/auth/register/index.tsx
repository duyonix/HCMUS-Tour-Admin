import React from "react";
import { toast } from "react-toastify";
import messages from "@/constants/messages";
import variables from "@/constants/variables";
import { Link, useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Checkbox
} from "antd";
import HCMUS from "@/assets/images/HCMUS.png";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import AuthService from "@/services/auth";

const { Title } = Typography;

const Register = () => {
  const authService = new AuthService();
  const history = useHistory();

  const formatData = (data: any) => {
    return {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      mobileNumber: data.mobileNumber
    };
  };

  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Mật khẩu và xác thực mật khẩu không khớp nhau");
      return;
    }
    const res = await authService.register(formatData(values));
    if (res.status === variables.OK) {
      toast.success("Đăng ký thành công");
      setTimeout(() => {
        history.push("/login");
      }, 1000);
    } else {
      if (res.status === variables.DUPLICATE_ENTITY) {
        toast.error(messages.DUPLICATE_ENTITY("email"));
      } else if (res.status === variables.ARGUMENT_NOT_VALID) {
        toast.error(res?.errors?.details || messages.ARGUMENT_NOT_VALID);
      } else {
        toast.error(messages.EXCEPTION);
      }
    }
  };

  return (
    <div
      className="login-page"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Row
        justify="center"
        align="middle"
        style={{ flexDirection: "column", flex: 1 }}
      >
        <>
          <img
            className="login-illustrator mt-3"
            style={{ width: "500px" }}
            src={HCMUS}
            alt="login-illustrator"
          />
          <Title level={3} style={{ margin: "5vh 0px 3vh 0" }}>
            Đăng ký vào HCMUS Tour Dashboard
          </Title>
          <Form
            style={{ maxWidth: "400px", width: "100%" }}
            name="admin-login"
            onFinish={onFinish}
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!"
                },
                {
                  type: "email",
                  message: "Email không hợp lệ!"
                }
              ]}
            >
              <Input placeholder="Email" prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              className="mt-2"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!"
                }
              ]}
            >
              <Input.Password placeholder="Mật khẩu" prefix={<KeyOutlined />} />
            </Form.Item>

            <Form.Item
              className="mt-2"
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "VUi lòng nhập xác thực mật khẩu!"
                }
              ]}
            >
              <Input.Password
                placeholder="Xác thực mật khẩu"
                prefix={<KeyOutlined />}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col md={12}>
                <Form.Item
                  className="mt-2"
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên!"
                    }
                  ]}
                >
                  <Input placeholder="Tên" />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  className="mt-2"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập họ!"
                    }
                  ]}
                >
                  <Input placeholder="Họ" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mt-2" name="mobileNumber">
              <Input placeholder="Số điện thoại" />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" className="mt-2">
              <Checkbox>
                Tôi đồng ý với{" "}
                <a href="#register" className="font-bold text-dark">
                  Điều khoản sử dụng
                </a>
              </Checkbox>
            </Form.Item>

            <Divider />
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                ĐĂNG KÝ
              </Button>
            </Form.Item>
            <p className="font-semibold text-muted text-center mt-1">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-dark font-bold">
                Đăng nhập tại đây
              </Link>
            </p>
          </Form>
        </>
      </Row>
    </div>
  );
};

export default Register;
