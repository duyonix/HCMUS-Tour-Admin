import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import RouteWithLayout from "@/layouts/RouteWithLayout";
import BaseLayout from "@/layouts/BaseLayout";
import { publicRoutes, privateRoutes } from "@/routes/config";
import NotFound from "@/components/NotFound";
import UnAuthorized from "@/components/UnAuthorized";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { RootState } from "@/app/store";
import { authActions } from "@/pages/auth/auth.slice";
import _ from "lodash";

const MyRoutes = () => {
  const auth = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const [priRoutes, setPriRoutes] = useState<any>(_.cloneDeep(privateRoutes));

  useEffect(() => {
    if (auth.isLogin) {
      const userId = localStorage.getItem("user_id");
      dispatch(authActions.getInfo(userId));
    }
  }, [auth.isLogin, dispatch]);

  useEffect(() => {
    if (auth.isLogin) {
      const newRoutes =
        auth.role !== "ADMIN"
          ? filterUserRoutes(_.cloneDeep(privateRoutes))
          : _.cloneDeep(privateRoutes);
      setPriRoutes(newRoutes);
    }
  }, [auth.isLogin, auth.role]);

  const filterUserRoutes = (routes: any) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].subMenu) {
        routes[i].subMenu = filterUserRoutes(routes[i].subMenu);
      } else if (routes[i].route) {
        routes[i] = {
          ...routes[i],
          route: routes[i].route.filter(r => r.role !== "ADMIN")
        };
      }
    }
    return routes;
  };

  const getDefaultRouteInPrivate = (routes: any) => {
    if (routes.subMenu && routes.subMenu.length > 0) {
      return getDefaultRoute(routes?.subMenu[0]);
    }
    return routes?.path;
  };

  const getDefaultRoute = (sidebar: any) => {
    if (localStorage.getItem("redirect_url")) {
      const redirectUrl = localStorage.getItem("redirect_url");
      return redirectUrl;
    } else if (auth.firstLogin) {
      return "/user/profile?firstLogin=true";
    }
    return getDefaultRouteInPrivate(sidebar);
  };

  const mapPrivateRoute = (menu: any, prevName: any) =>
    menu.map((item: any) => {
      if (item.subMenu && item.subMenu.length > 0) {
        return mapPrivateRoute(item.subMenu, prevName.concat([item.title]));
      }
      if (item.route && item.route.length > 0) {
        return item.route.map((route: any) => {
          return (
            <RouteWithLayout
              key={"rootMenu"}
              path={route.path}
              component={route.component}
              layout={BaseLayout}
              routeConfig={{
                breadcrumb: prevName.concat([item.title]),
                path: item.path,
                title: prevName.join("/") + "/" + item.title
              }}
            />
          );
        });
      }
      return null;
    });

  return (
    <div>
      <Switch>
        {auth.isLogin &&
          priRoutes.map(({ redirect, path: pathRoot }, index) => (
            <Route key={index} exact path={pathRoot}>
              <Redirect to={`${redirect}`} />
            </Route>
          ))}
        {auth.isLogin
          ? mapPrivateRoute([...priRoutes], [])
          : publicRoutes.map(({ path, component }, index) => (
              <Route key={index} path={path} component={component} />
            ))}

        {auth.isLogin && (
          <Route exact path="/403">
            <UnAuthorized />
          </Route>
        )}

        {auth.isLogin ? (
          <>
            <Route exact path="/">
              <Redirect
                to={priRoutes.length ? getDefaultRoute(priRoutes[0]) : "/"}
              />
            </Route>
            <Route exact path="/login">
              <Redirect to="/" />
            </Route>
            {priRoutes.length > 0 && (
              <Route path="*">
                <NotFound />
              </Route>
            )}
          </>
        ) : (
          <Route path="*">
            <Redirect to="/login" />
          </Route>
        )}
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
};

export default MyRoutes;
