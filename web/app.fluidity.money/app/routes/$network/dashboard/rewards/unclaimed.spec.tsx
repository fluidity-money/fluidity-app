import React, { ReactNode } from "react";
import { render } from "@testing-library/react";
import UnclaimedWinnings, {
    loader,
}
from "./unclaimed";

import FluidityFacadeContext from "contexts/FluidityFacade";

const renderWithContext = (component: ReactNode, contextProps: Record<string, unknown>) => {
    return render(
        <FluidityFacadeContext.Provider value={contextProps}>
            {component}
        </FluidityFacadeContext.Provider>
    );
}

jest.mock("@remix-run/react", () => ({
    ...jest.requireActual("@remix-run/react"),
    useLoaderData: () => ({
        network: "ethereum",
        tokenDetailsMap: {
            "USDC": {
                address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                logo: "https://example.com/example.png",
            },
            "fUSDC": {
                address: "0x9d1089802eE608BA84C5c98211afE5f37F96B36C",
                logo: "https://example.com/example.png",
            },
        },
        fluidTokenMap: {
            "fUSDC": "0x9d1089802eE608BA84C5c98211afE5f37F96B36C",
            "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        },
    }),
}));

describe("UnclaimedWinnings", () => {
    it("Renders without error", () => {
        const result = renderWithContext(<UnclaimedWinnings />, {
            connected: true,
            address: "0xeb6b882a295d316ac62c8cfcc81c3e37c084b7c5",
        });
        
        expect(result).toBeTruthy();
    });
})