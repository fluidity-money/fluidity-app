import { Outlet } from "@remix-run/react";

export default function Network() {
  // TODO: Inject Chain Provider
  return (
    <>
      <Outlet />
    </>
  );
}
