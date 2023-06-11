import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Spin,
  Table,
  Space,
  Typography,
  Image
} from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import qs from "query-string";
import ServiceService from "@/services/service";
import useFetch from "@/hooks/useFetch";
import { useHistory, useLocation } from "react-router-dom";
import {
  changePage,
  objectToQueryString,
  cleanObject,
  mappingOptions
} from "@/utils";
import Filter from "@/components/Filter";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/ConfirmModal";
import messages from "@/constants/messages";
import variables from "@/constants/variables";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/app/store";
import { serviceActions } from "../service.slice";

const { Text } = Typography;

const ServiceScopes = () => {
  const serviceService = new ServiceService();
  const auth = useAppSelector((state: RootState) => state.auth);
  const categoryOptions = useAppSelector(
    (state: RootState) => state.service.categoryOptions
  );
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const queryString = qs.parse(location.search);
  const size = 10;
  const page = queryString.page ? Number(queryString.page) - 1 : 0;
  const { loading, list, total, onReFetch } = useFetch({
    params: JSON.stringify(cleanObject({ ...queryString, page, size })),
    func: serviceService.scope.getScopes,
    valueProp: "payload.content",
    totalProp: "payload.totalElements"
  });

  useEffect(() => {
    dispatch(serviceActions.getCategoryOptions());
  }, [dispatch]);

  const onAdd = () => {
    history.push(`${location.pathname}/add`);
  };
  const onEdit = (id: number) => {
    history.push(`${location.pathname}/${id}`);
  };
  const onDelete = async (id: number, index: number) => {
    setIsDeleteLoading(true);
    const res = await serviceService.scope.deleteScope(id.toString());
    setIsDeleteLoading(false);

    if (res.status === variables.OK) {
      toast.success(messages.DELETE_SUCCESS("đối tượng"));
      if (index === total && index !== 1 && index % size === 1) {
        history.push(
          "?" +
            objectToQueryString({
              ...queryString,
              page: index / size
            })
        );
      } else {
        onReFetch();
      }
    } else {
      switch (res?.status) {
        case variables.ALREADY_USED_ELSEWHERE:
          return toast.error(messages.ALREADY_USED_ELSEWHERE("đối tượng"));
        default:
          return toast.error(messages.DELETE_FAILED("đối tượng"));
      }
    }
  };

  const onConfirmRemove = (id: number, index: number) => {
    ConfirmModal({
      title: messages.CONFIRM_DELETE("đối tượng"),
      onOk() {
        onDelete(id, index);
      }
    });
  };

  const columns = [
    {
      title: "STT",
      render: (_: any, __: any, index: number) => page * size + index + 1,
      width: 100
    },
    {
      title: "Tên đối tượng",
      dataIndex: "name",
      width: 250
    },
    {
      title: "Logo",
      dataIndex: "logo",
      render: (data: string) => (
        <Image
          className="preview-icon-only"
          height={60}
          width={90}
          src={data}
        />
      ),
      width: 200
    },
    {
      title: "Phân loại",
      dataIndex: ["category", "name"],
      width: 200
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: 400,
      render: (text: string) => <Text className="text-limit">{text}</Text>
    },
    {
      title: "",
      dataIndex: "id",
      align: "right",
      render: (id: number, _: any, index: number) => (
        <Space size="middle">
          <Button
            onClick={() => onEdit(id)}
            type="primary"
            icon={auth.role === "ADMIN" ? <EditOutlined /> : <EyeOutlined />}
          ></Button>
          {auth.role === "ADMIN" && (
            <Button
              onClick={() => onConfirmRemove(id, page * size + index + 1)}
              icon={<DeleteOutlined />}
            ></Button>
          )}
        </Space>
      )
    }
  ];
  return (
    <>
      <Filter
        filterSelects={[
          {
            label: "Phân loại",
            name: "categoryId",
            options: mappingOptions(categoryOptions.data, "id", "name")
          }
        ]}
        isReset
        placeholder="Tìm kiếm theo tên đối tượng"
        isSearch
        nameSearch="search"
      />
      <Card className="m-2 radius-lg">
        <Row className="mb-2" justify="space-between">
          <Col className="d-flex al-center">Tổng cộng: {total} đối tượng</Col>
          {auth.role === "ADMIN" && (
            <Button type="primary" onClick={onAdd}>
              Thêm mới
            </Button>
          )}
        </Row>
        <Spin size="large" spinning={loading || isDeleteLoading}>
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
                Không có đối tượng nào được tìm thấy
              </div>
            )
          )}
        </Spin>
      </Card>
    </>
  );
};

export default ServiceScopes;
