
const pickCss = (args : any[][]) : string =>
  args.map(([ok, c]) => ok === true ? c : "")
    .join(" ");

export default pickCss;
