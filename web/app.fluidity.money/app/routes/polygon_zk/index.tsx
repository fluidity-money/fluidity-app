import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return redirect(`/polygon_zk/dashboard/home`);
};
