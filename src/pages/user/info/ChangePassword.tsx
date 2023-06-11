import React, { useState } from "react";
import { toast } from "react-toastify";
import messages from "@/constants/messages";
import variables from "@/constants/variables";
import { Row, Col, Form, Input, Button, Divider, Checkbox } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import UserService from "@/services/user";
import AuthService from "@/services/auth";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { authActions } from "@/pages/auth/auth.slice";

type Props = {
  email: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const ChangePassword = ({ email, loading, setLoading }: Props) => {
  const userService = new UserService();
  const authService = new AuthService();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [isChange, setIsChange] = useState(false);
  const [form] = Form.useForm();

  const formatData = (data: any) => {
    return {
      email,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    };
  };

  const onFinish = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      toast.error("Mật khẩu mới và xác thực mật khẩu không khớp nhau");
      return;
    }
    setLoading(true);
    const res = await userService.updatePassword(formatData(values));
    if (res.status === variables.OK) {
      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại");
      authService.logout().then(() => {
        setTimeout(() => {
          dispatch(authActions.logoutSuccess());
        }, 1000);
      });
    } else {
      if (res.status === variables.NOT_MATCH) {
        toast.error("Mật khẩu cũ không chính xác");
      } else {
        toast.error(messages.EXCEPTION);
      }
    }
    setLoading(false);
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ flexDirection: "column", flex: 1 }}
    >
      <>
        <Form
          form={form}
          layout="vertical"
          name="change-password"
          onValuesChange={() => {
            setIsChange(true);
          }}
          onFinish={onFinish}
        >
          <Form.Item
            className="mt-2"
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu cũ!"
              }
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} />
          </Form.Item>
          <Form.Item
            className="mt-2"
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới!"
              }
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} />
          </Form.Item>
          <Form.Item
            className="mt-2"
            name="confirmPassword"
            label="Xác thực mật khẩu mới"
            rules={[
              {
                required: true,
                message: "Vui lòng xác thực mật khẩu mới!"
              }
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} />
          </Form.Item>
        </Form>

        <Button
          disabled={!isChange}
          className="button mt-3"
          type="primary"
          htmlType="submit"
          onClick={() => form.submit()}
        >
          Thay đổi mật khẩu
        </Button>
      </>
    </Row>
  );
};

export default ChangePassword;
