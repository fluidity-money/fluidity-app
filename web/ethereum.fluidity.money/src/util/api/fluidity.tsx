// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import axios from "axios";

export const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": `${process.env.REACT_APP_API_URL}`,
  'Access-Control-Allow-Methods': 'POST',
}

export default axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
