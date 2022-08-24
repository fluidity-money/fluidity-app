// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TribecaDataStore } from "../target/types/trf_data_store";

describe("trf-data-store", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.TrfDataStore as Program<TrfDataStore>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
