import { Outlet } from "react-router-dom";

export const DashLayout = () => {
  return (
    <>
      Dashboard Outlet
      <Outlet />
    </>
  );
};

export default DashLayout;
