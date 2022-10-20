const jsonPost = async <Req, Res>(url: string, body: Req): Promise<Res> => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  });

  const json = await res.json();

  return json;
};

export { jsonPost };
