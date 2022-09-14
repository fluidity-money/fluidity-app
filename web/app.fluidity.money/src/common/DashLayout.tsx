import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "@sentry/react";
import Error from "@/screens/Error";

export const DashLayout = () => {
  return (
    <>
      Dashboard Outlet
      <ErrorBoundary fallback={Error}>
        <Outlet />
      </ErrorBoundary>
    </>
  );
};

export default DashLayout;
