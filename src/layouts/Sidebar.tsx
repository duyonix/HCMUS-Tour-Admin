import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/images/FIT.jpg";
import { Menu } from "antd";
import { useAppSelector } from "@/hooks";
import { RootState } from "@/app/store";
import { privateRoutes } from "@/routes/config";

type Props = {
  routeConfig: any;
};

const Sidebar = ({ routeConfig }: Props) => {
  const { breadcrumb } = routeConfig;
  const maxLength: number = breadcrumb.length - 1;
  const auth = useAppSelector((state: RootState) => state.auth);

  const mapOpenKey = (arr: string[]): string[] => {
    let prev = arr[0];
    return arr.map((item: string, index: number) => {
      if (index === 0) {
        return item;
      } else {
        prev = prev + "/" + item;
        return prev;
      }
    });
  };

  const openKeys = mapOpenKey(
    breadcrumb.filter((key: string, index: number) => index !== maxLength)
  );

  const mapSidebar = (
    sidebar: any,
    level: number = 0,
    prevKey: string = ""
  ) => {
    const menu =
      auth.role !== "ADMIN"
        ? sidebar.filter((item: any) => item.role !== "ADMIN")
        : sidebar;

    return menu.map((item: any) => {
      if (item.subMenu) {
        const keyItem = prevKey ? `${prevKey}/${item.title}` : item.title;
        return {
          label: item.title,
          key: keyItem,
          icon: item.icon ? item.icon : "",
          children: mapSidebar(item.subMenu, level + 1, keyItem)
        };
      }
      return {
        label: (
          <Link className={`level-${level}-menu-title`} to={item.path}>
            {item.title}
          </Link>
        ),
        key: prevKey ? `${prevKey}/${item.title}` : item.title
      };
    });
  };

  return (
    <div
      className="bg-white h-100% mh-100vh"
      style={{
        overflowX: "hidden"
      }}
    >
      <div className="style-logo-admin sticky bg-white">
        <Link to="/">
          <img src={logo} alt="logo" height={50} className="w-100"></img>
        </Link>
      </div>
      <Menu
        mode="inline"
        defaultOpenKeys={openKeys}
        selectedKeys={[routeConfig.title]}
        forceSubMenuRender
        items={mapSidebar(privateRoutes)}
      ></Menu>
    </div>
  );
};

export default Sidebar;
