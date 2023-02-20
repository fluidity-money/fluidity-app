const jsonPost = async <Req = { query: string }, Res = { data: Record<string, unknown> }>(
  url: string,
  body: Req,
  headers?: Record<string, string>
): Promise<Res> => {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(headers ? headers : {}),
      },
      method: "POST",
      body: JSON.stringify(body),
    });

    const json = await res.json();

    return json;
  } catch (e) {
    throw new Error(`Could not parse JSON: ${e}`);
  }
};

const jsonGet = async <
  Req extends Record<string, string | number | boolean>,
  Res
>(
  url: string,
  params_?: Req,
  headers?: Record<string, string>
): Promise<Res> => {
  try {
    const params = params_ || ({} as Req);

    const queryString = Object.entries(params)
      .map(
        ([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
      )
      .join("&");

    const res = await fetch(`${url}?${queryString}`, {
      headers: {
        "Content-Type": "application/json",
        ...(headers ? headers : {}),
      },
    });

    const json = await res.json();

    return json;
  } catch (e) {
    throw new Error(`Could not parse JSON: ${e}`);
  }
};

export { jsonPost, jsonGet };
