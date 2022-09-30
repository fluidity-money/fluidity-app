// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import LandingPage from "pageBody/LandingPage";

const LaunchPage = () => {

  useEffect(() => {
    window.location.hash = "demo";
  });

  return (
    <LandingPage />
  );
};

export default LaunchPage;