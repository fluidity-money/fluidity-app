export default interface Result<Ok, Err> {
  map<O>(f: (value: Ok) => O): Result<O, Err>;
  flatMap<O>(f: (value: Ok) => Result<O, Err>): Result<O, Err>;
  match<O>(x: { Ok: (O: Ok) => O; Err: (O: Err) => O }): O;
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
});

export const Err = <Ok, Err = any>(value: Err): Result<Ok, Err> => ({
  map: (_) => Err(value),
  flatMap: (_f) => Err(value),
  match: ({ Err }) => Err(value),
});
