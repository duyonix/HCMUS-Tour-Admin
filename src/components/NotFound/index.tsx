import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";
import messages from "@/constants/messages";

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle={messages.PAGE_NOT_FOUND}
      extra={
        <Link to="/">
          <Button type="primary">Về Trang chủ</Button>
        </Link>
      }
    />
  );
};

export default NotFound;
