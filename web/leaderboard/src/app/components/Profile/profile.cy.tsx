import React from "react";
import { Profile } from "./index";

describe("<Profile />", () => {
  it("mounts <Profile />", () => {
    cy.mount(<Profile />);
  });
});
