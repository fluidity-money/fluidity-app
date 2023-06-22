export default interface Result<Ok, Err> {
  map<O>(f: (value: Ok) => O): Result<O, Err>;
  flatMap<O>(f: (value: Ok) => Result<O, Err>): Result<O, Err>;
  match<O>(x: { Ok: (O: Ok) => O; Err: (O: Err) => O }): O;
  err(f: (value: Err) => Err): Result<Ok, Err>;
}

export const Ok = <Ok, Err = any>(value: Ok): Result<Ok, Err> => ({
  map: (f) => {
    try {
      return Ok(f(value));
    } catch (e) {
      return Err(e as Err);
    }
  },
  flatMap: (f) => {
    try {
      return f(value);
    } catch (e) {
      return Err(e as Err);
    }
  },
  match: ({ Ok }) => Ok(value),
  err: (_f) => Ok(value),
});

export const Err = <Ok, Err = any>(value: Err): Result<Ok, Err> => ({
  map: (_) => Err(value),
  flatMap: (_f) => Err(value),
  match: ({ Err }) => Err(value),
  // May throw an Error
  err: (f) => Err(f(value)),
});

// flatten an Array of Results<Ok> into a Result of Array<Ok>, or Err
export const flatten = <Ok, Err = any>(
  results: Result<Ok, Err>[]
): Result<Ok[], Err> =>
  results.reduce(
    (aggregateRes: Result<Ok[], Err>, res: Result<Ok, Err>) =>
      res.match<Result<Ok[], Err>>({
        Ok: (el) => aggregateRes.map((agg) => [...agg, el]),
        Err: (e) => Err(e),
      }),
    Ok([])
  );

export const sync = async <Ok, Err = any>(
  res: Result<Promise<Ok>, Err>
): Promise<Result<Ok, Err>> =>
  res.match({
    Ok: async (promise) => Ok(await promise),
    Err: async (e) => Err(e),
  });

export const flatPromise = async (
  promise: Promise<Promise<number>>
): Promise<number> => Promise.resolve(promise);

export const isOk = (result: Result<unknown, unknown>) =>
  result.match({
    Ok: (_) => true,
    Err: (_) => false,
  });
