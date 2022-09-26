import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
  return redirect("./home", 301);
};
