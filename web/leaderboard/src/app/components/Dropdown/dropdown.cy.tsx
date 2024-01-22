import React from "react";
import { DropdownOptions } from "./index";
import "@fluidity-money/surfing";
import "./Dropdown.module.scss";

describe("DropdownOptions Component", () => {
  let setSortedByItem: any;
  let setOpenDropdown: any;
  let sortData: any;

  beforeEach(() => {
    setSortedByItem = cy.stub();
    setOpenDropdown = cy.stub();
    sortData = cy.stub();

    cy.mount(
      <DropdownOptions
        setSortedByItem={setSortedByItem}
        setOpenDropdown={setOpenDropdown}
        sortData={sortData}
      />
    );
  });

  it("renders correctly", () => {
    cy.get("[class*='dropdown_options']").should("exist");
    cy.get("[class*='dropdown_options'] ul li").should("have.length", 3);
  });

  it("handles option click correctly", () => {
    const optionTitles = ["volume", "rewards", "number"];

    optionTitles.forEach((title, index) => {
      cy.get("[class*='dropdown_options'] ul li")
        .eq(index)
        .click()
        .then(() => {
          expect(setSortedByItem).to.be.calledWith(optionTitles[index]);
          expect(setOpenDropdown).to.be.calledWith(false);
          expect(sortData).to.be.calledWith(optionTitles[index].toLowerCase());
        });
    });
  });
});
