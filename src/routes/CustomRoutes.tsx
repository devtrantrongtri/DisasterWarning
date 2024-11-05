import React, { ReactNode } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { PublicRoute, PrivateRoute } from ".";
import { RouteType } from "../interfaces/RouteType";
import NotFoundPage from "../pages/NotFoundPage";
import DefaultLayout from "../layouts/DefaultLayout";

const isAuthenticated = () => {
  // return localStorage.getItem("token") !== null;
  return true;
};
type PrivateRouteWrapperProps = {
  children: ReactNode;
};
// Wrapper component for private routes
const PrivateRouteWrapper: React.FC<PrivateRouteWrapperProps> = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const CustomRoutes: React.FC = () => {
  const renderRoutes = (routes: RouteType[], isPrivate: boolean = false) =>
    routes.map((route, index) => {
      const Component = route.page;
      const Layout = route.layout || DefaultLayout;

      const element = (
        <Layout>
          <Component />
        </Layout>
      );

      return (
        <Route
          key={index}
          path={route.path}
          element={
            isPrivate ? (
              <PrivateRouteWrapper>{element}</PrivateRouteWrapper>
            ) : (
              element
            )
          }
        >
          {route.children && renderRoutes(route.children, isPrivate)}
        </Route>
      );
    });

  return (
    <Routes>
      {renderRoutes(PublicRoute)}
      {renderRoutes(PrivateRoute, true)}
      <Route
        path="*"
        element={
          <DefaultLayout>
            <NotFoundPage />
          </DefaultLayout>
        }
      />
    </Routes>
  );
};

export default CustomRoutes;
