import type { NextApiRequest, NextApiResponse } from "next";

type User = {
  address: string;
  number_of_transactions: number;
  rank: number;
  volume: number;
  yield_earned: number;
};

const users = [
  {
    address: "0x21f2275f26611fba1d486153b5d2d78164568435",
    number_of_transactions: 21898,
    rank: 2388,
    volume: 255.13345799999914,
    yield_earned: 18.985949367059586,
  },
  {
    address: "0x1cb94adfd3314d48ca8145b2c6983419257c0486",
    number_of_transactions: 12520,
    rank: 3682,
    volume: 894699.873285003,
    yield_earned: 482.0982366909158,
  },
  {
    address: "0xe776ffdab7b40147fc0b8e93676eb444fb3650b6",
    number_of_transactions: 7135,
    rank: 4260,
    volume: 240194.4372060101,
    yield_earned: 920.81961067,
  },
];

describe("Home Page Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001");
  });

  it("loads the main elements on the page", () => {
    cy.get("main").should("exist");
    cy.get('[class*="header"]').should("exist");
    cy.contains("h1", "Fluidity Leaderboard").should("exist");
  });

  it("change filters on click all time", () => {
    cy.get("[data-cy=all-btn]").click();
    cy.get("[data-cy=title]").contains("ALL TIME");
  });

  it("open Connect Wallet Modal", () => {
    cy.get('[class*="connected_wallet"]').should("exist");
    cy.get('[class*="connected_wallet"]').click();
    cy.wait(10000);
    cy.get('[class*="connect-wallet-outer-container"]').should("exist");
  });

  it("Confirms the number of adresses in the table", () => {
    expect(users).to.be.an("array");

    users.forEach((user) => {
      expect(user).to.have.all.keys(
        "address",
        "number_of_transactions",
        "rank",
        "volume",
        "yield_earned"
      );
      expect(user.address).to.be.a("string");
      expect(user.number_of_transactions).to.be.a("number");
      expect(user.rank).to.be.a("number");
      expect(user.volume).to.be.a("number");
      expect(user.yield_earned).to.be.a("number");
    });
  });
});
