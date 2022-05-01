const Base58 = require("base-58");

function _base64ToArrayBuffer(base64) {
  var binary_string = atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}

const b64 =
  "AW/w4wPhstQx+SWlY+fUyuqbFsMRzQ8u5ttqWDY9Dyla/uM7T5wCWCSNUIxIBrvcFzd8Fc/exOjSgjqIjIFyeAQBAAIE/giFiZcAmeikbfiQMwVwYiH7NCo1wVS6nYgzMzFDFWh8f61ZBxb3U0MeJLTNQeMUqv+jA+LF3npjISpW/3F7jwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOKR+f9FMmPcIYNS3RiFa2NZ6Q8vY2BmQeIFGawkAEeWXtz5E7EJSkSRL0ucWpclg7IstzFnspoQN4/eERBohvQEDAwEAAgmvr20fDZib7f8=";

console.log(_base64ToArrayBuffer(b64));
const b58 = Base58.encode(_base64ToArrayBuffer(b64));
console.log(b58);
