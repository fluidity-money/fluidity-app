import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
  return redirect(`/${params.network}/transfer/send`, 301);
};
