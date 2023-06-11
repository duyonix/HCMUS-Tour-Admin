import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";
import messages from "@/constants/messages";

const UnAuthorized = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle={messages.TITLE_PERMISSION_DENIED}
      extra={
        <Link to="/">
          <Button type="primary">Về trang chủ</Button>
        </Link>
      }
    />
  );
};

export default UnAuthorized;
