import React, { useEffect } from "react";
import { Card, Col, Form, Input, Row, Select, Space, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import qs from "query-string";
import styled from "styled-components";
import "./style.scss";
import _ from "lodash";
import { useHistory, useLocation } from "react-router-dom";
import { objectToQueryString } from "@/utils";

const StyledButton = styled(Button)`
  border-radius: 4px;
  padding: 10px 16px;
`;

const StyledSpace = styled(Space)`
  width: 100%;
`;

type Props = {
  filterSelects?: any[];
  isSearch?: boolean;
  isReset?: boolean;
  isExport?: boolean;
  placeholder?: string;
  actionReset?: (() => void) | null;
  actionExport?: (() => void) | null;
  actionSearch?: ((value: any, e: any) => void) | null;
  getValueOnChange?: ((value: any, e: any) => void) | null;
  nameSearch?: string;
  bordered?: boolean;
  position?: "left" | "right";
  noPadding?: boolean;
  style?: any;
};

const Filter = ({
  filterSelects = [],
  isSearch = false,
  isReset = false,
  isExport = false,
  placeholder,
  actionReset = null,
  actionExport,
  actionSearch = null,
  getValueOnChange = null,
  nameSearch = "keyword",
  bordered = true,
  position = "left",
  noPadding = false,
  style = {}
}: Props) => {
  const [form] = Form.useForm();
  const location = useLocation();
  const history = useHistory();
  const queryString = qs.parse(location.search);
  const defaultSize = 4;

  useEffect(() => {
    if (Object.keys(queryString).length) {
      const formValues = getFormValues(queryString);
      form.setFieldsValue({
        ...formValues,
        [nameSearch]: formValues[nameSearch] ? formValues[nameSearch] : ""
      });
    } else {
      form.resetFields();
    }
  }, [location.search]);

  const getFormValues = values => {
    return values;
  };

  const onSearch = (value, e) => {
    if (actionSearch) {
      return actionSearch(value, e);
    }
    delete queryString.path;
    history.push(
      "?" +
        objectToQueryString({
          ...queryString,
          [nameSearch]: value,
          page: 1
        })
    );
  };

  const onReset = () => {
    actionReset ? actionReset() : history.push(location.pathname);
    form.resetFields();
  };

  const addOptionAll = list => {
    return [
      {
        value: "",
        label: "Tất cả"
      }
    ].concat(list);
  };

  const onChangeFilter = (name, value) => {
    if (getValueOnChange) {
      return getValueOnChange({ name, value }, form);
    }
    history.push(
      "?" +
        objectToQueryString({
          ...queryString,
          [name]: value,
          page: 1
        })
    );
  };

  return (
    <div
      className={`radius-xl ${noPadding ? "mb-2" : "m-2"}`}
      style={
        noPadding
          ? {
              marginLeft: "-2px",
              marginRight: "-2px",
              ...style
            }
          : { ...style }
      }
    >
      <div
        style={{
          padding: "2px"
        }}
      >
        <Card
          bordered={bordered}
          className={`${noPadding ? "no-padding-body-antd" : ""}`}
        >
          <Form layout="vertical" form={form} name="control-hooks">
            <Row
              gutter={[8, 10]}
              style={{
                alignItems: "flex-end",
                justifyContent: position === "left" ? "start" : "end"
              }}
            >
              {filterSelects.map((item: any, index) => {
                return (
                  <Col key={index} span={item.size || defaultSize}>
                    <Form.Item
                      name={item.name}
                      label={item.label}
                      initialValue={item.initialValue || ""}
                    >
                      <Select
                        showSearch={item.showSearch}
                        options={
                          item.notIncludeAll
                            ? item.options
                            : addOptionAll(item.options)
                        }
                        optionFilterProp="label"
                        onChange={value => onChangeFilter(item.name, value)}
                      />
                    </Form.Item>
                  </Col>
                );
              })}

              {isSearch && (
                <Col flex={1}>
                  <Form.Item name={nameSearch}>
                    <Input.Search
                      onSearch={onSearch}
                      placeholder={placeholder}
                      className="search-with-icon"
                      enterButton={
                        <Button type="primary" htmlType="submit">
                          <SearchOutlined />
                        </Button>
                      }
                      prefix={<SearchOutlined />}
                    />
                  </Form.Item>
                </Col>
              )}

              {isReset && (
                <Col xs={3} xxl={2} className="text-right">
                  <Form.Item>
                    <StyledSpace className="button-search">
                      {isReset && (
                        <StyledButton htmlType="button" onClick={onReset}>
                          Hủy bộ lọc
                        </StyledButton>
                      )}
                    </StyledSpace>
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Filter;
