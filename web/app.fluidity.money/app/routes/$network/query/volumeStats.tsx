import { json, LoaderFunction } from "@remix-run/node";
import BN, { BN } from "bn.js";
import { useVolumeCalculation, VolumeCalculationResponse } from "~/queries/useVolumeCalculation";
import config from "~/webapp.config.server";

export const loader: LoaderFunction = async ({ params }) => {
    const { network } = params;

    // Postprocess res
    const fdaiPostprocess = (value: VolumeCalculationResponse) => {
        const bn = new BN(value.data.ethereum.transfers[0].amount);
        const decimals = new BN(10).pow(new BN(12));
        const amount = bn.div(decimals).toString()

        console.log(amount)

        return {...value, 
                data: {
                    ethereum: {
                        transfers: [{
                            amount
                        }]
                    }
                }
        };
    }
    
    const volumes = config.config[network ?? ""].tokens
    .filter(({ isFluidOf }) => isFluidOf)
    .map(
        ({
            symbol,
            address,
        }) => (symbol !== "fDAI" ? useVolumeCalculation(address) : useVolumeCalculation(address).then(fdaiPostprocess))
    );



    console.log(config.config[network ?? ""].tokens
    .filter(({ isFluidOf }) => isFluidOf))
    const result = await Promise.all(volumes);

    const aggregateBn = result.reduce<BN>((acc, curr) => {
        return acc.add(new BN(curr.data.ethereum.transfers[0].amount));
    }, new BN(0));

    const aggregate = aggregateBn.toString();

    return json({
        aggregate
    });
}