import React from "react";
import { Button, Card, Col, Row, Spin, Table, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import qs from "query-string";
import UserService from "@/services/user";
import useFetch from "@/hooks/useFetch";
import { useHistory, useLocation } from "react-router-dom";
import { changePage, cleanObject } from "@/utils";
import Filter from "@/components/Filter";
import { ROLE_OPTIONS } from "@/constants/variables";

const UsersManagement = () => {
  const userService = new UserService();
  const history = useHistory();
  const location = useLocation();
  const queryString = qs.parse(location.search);
  const size = 10;
  const page = queryString.page ? Number(queryString.page) - 1 : 0;
  const { loading, list, total } = useFetch({
    params: JSON.stringify(cleanObject({ ...queryString, page, size })),
    func: userService.getUsers,
    valueProp: "payload.content",
    totalProp: "payload.totalElements"
  });

  const onEdit = (id: number) => {
    history.push(`${location.pathname}/${id}`);
  };

  const columns = [
    {
      title: "STT",
      render: (_: any, __: any, index: number) => page * size + index + 1,
      width: 100
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 250
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      width: 250
    },
    {
      title: "Phân quyền",
      dataIndex: "role",
      align: "center",
      render: data => (
        <Tag color={data === "ADMIN" ? "gold" : "green"}>{data}</Tag>
      ),
      width: 150
    },
    {
      title: "",
      dataIndex: "id",
      align: "right",
      render: (id: number) => (
        <Button
          onClick={() => onEdit(id)}
          type="primary"
          icon={<EditOutlined />}
        ></Button>
      )
    }
  ];
  return (
    <>
      <Filter
        filterSelects={[
          {
            label: "Phân quyền",
            name: "role",
            options: ROLE_OPTIONS
          }
        ]}
        isReset
        placeholder="Tìm kiếm theo email"
        isSearch
        nameSearch="search"
      />
      <Card className="m-2 radius-lg">
        <Row className="mb-2" justify="space-between">
          <Col className="d-flex al-center">Tổng cộng: {total} người dùng</Col>
        </Row>
        <Spin size="large" spinning={loading}>
          {list.length > 0 ? (
            <Table
              columns={columns as any}
              dataSource={list}
              rowKey="id"
              pagination={{
                position: ["bottomCenter"],
                total,
                showSizeChanger: false,
                pageSize: size,
                current: page + 1,
                onChange(current) {
                  changePage(history, current);
                }
              }}
            ></Table>
          ) : (
            !loading && (
              <div className="text-center m-4">
                Không người dùng nào được tìm thấy
              </div>
            )
          )}
        </Spin>
      </Card>
    </>
  );
};

export default UsersManagement;
