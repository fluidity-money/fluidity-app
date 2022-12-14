import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const defaultNetwork = "ethereum";

  return redirect(`/${defaultNetwork}/dashboard/home`);
};
