import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  return redirect(`/${network}/dashboard/home`, 301);
};
