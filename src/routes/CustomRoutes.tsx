import React from "react";
import { Route, Routes } from "react-router-dom";
import { PublicRoute } from ".";
import { RouteType } from "../interfaces/RouteType";
import NotFoundPage from "../pages/NotFoundPage";
import NoneLayout from "../layouts/NoneLayout";


const CustomRoutes: React.FC = () => {
  const renderRoutes = (routes: RouteType[]) =>
    routes.map((route, index) => {
      const Component = route.page;
      const Layout = route.layout || NoneLayout;

      return (
        <Route
          key={index}
          path={route.path}
          element={
            <Layout>
              <Component />
            </Layout>
          }
        >
          {route.children && renderRoutes(route.children)}
        </Route>
      );
    });

  return (
    <Routes>
      {renderRoutes(PublicRoute)}
      <Route
        path="*"
        element={
          <NoneLayout>
            <NotFoundPage />
          </NoneLayout>
        }
      />

    </Routes>
  );
};

export default CustomRoutes;
