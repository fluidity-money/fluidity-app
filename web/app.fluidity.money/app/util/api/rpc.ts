const jsonPost = async <Req, Res>(
  url: string,
  body: Req,
  headers?: { [key: string]: string }
): Promise<Res> => {
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
};

export { jsonPost };
