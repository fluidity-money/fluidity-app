// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import axios from "axios";

export const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*.fluidity.money",
  'Access-Control-Allow-Methods': 'POST'
}

export default axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
