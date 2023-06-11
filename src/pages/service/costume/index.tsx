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

const ServiceCostumes = () => {
  const serviceService = new ServiceService();
  const auth = useAppSelector((state: RootState) => state.auth);
  const scopeOptions = useAppSelector(
    (state: RootState) => state.service.scopeOptions
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
    func: serviceService.costume.getCostumes,
    valueProp: "payload.content",
    totalProp: "payload.totalElements"
  });

  useEffect(() => {
    dispatch(serviceActions.getScopeOptions());
  }, [dispatch]);

  const onAdd = () => {
    history.push(`${location.pathname}/add`);
  };
  const onEdit = (id: number) => {
    history.push(`${location.pathname}/${id}`);
  };
  const onDelete = async (id: number, index: number) => {
    setIsDeleteLoading(true);
    const res = await serviceService.costume.deleteCostume(id.toString());
    setIsDeleteLoading(false);

    if (res.status === variables.OK) {
      toast.success(messages.DELETE_SUCCESS("costume"));
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
          return toast.error(messages.ALREADY_USED_ELSEWHERE("costume"));
        default:
          return toast.error(messages.DELETE_FAILED("costume"));
      }
    }
  };

  const onConfirmRemove = (id: number, index: number) => {
    ConfirmModal({
      title: messages.CONFIRM_DELETE("costume"),
      onOk() {
        onDelete(id, index);
      }
    });
  };

  const columns = [
    {
      title: "No.",
      render: (_: any, __: any, index: number) => page * size + index + 1,
      width: 100
    },
    {
      title: "Costume Name",
      dataIndex: "name",
      width: 250
    },
    {
      title: "Picture",
      dataIndex: "picture",
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
      title: "Scope",
      dataIndex: ["scope", "name"],
      width: 200
    },
    {
      title: "Description",
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
            label: "Scope",
            name: "scopeId",
            options: mappingOptions(scopeOptions.data, "id", "name")
          }
        ]}
        isReset
        placeholder="Search by Name"
        isSearch
        nameSearch="search"
      />
      <Card className="m-2 radius-lg">
        <Row className="mb-2" justify="space-between">
          <Col className="d-flex al-center">Total: {total}</Col>
          {auth.role === "ADMIN" && (
            <Button type="primary" onClick={onAdd}>
              Add
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
            !loading && <div className="text-center m-4">No costumes found</div>
          )}
        </Spin>
      </Card>
    </>
  );
};

export default ServiceCostumes;
