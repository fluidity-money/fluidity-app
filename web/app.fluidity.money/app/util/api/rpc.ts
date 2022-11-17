const jsonPost = async <Req, Res>(
  url: string,
  body: Req,
  headers?: { [key: string]: string }
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

export { jsonPost };
