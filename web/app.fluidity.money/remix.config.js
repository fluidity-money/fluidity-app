/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverDependenciesToBundle: [
    /^react-dnd.*/,
    /^@react-dnd.*/,
    /^react-dnd-html5-backend.*/,
    /^react-dnd-touch-backend.*/,
    "dnd-core",
  ],
};
