import { useState } from "react";
import { Asset } from "~/queries/useTokens";
import TokenSelectModal from "./TokenSelectModal";

const TokenSelect = ({
    assets = [],
    onChange,
    value,
    disabled,
}: {
    assets: Asset[];
    onChange: (token: Asset) => void;
    value?: Asset;
    disabled?: boolean;
}) => {
    const [open, setOpen] = useState(false);

    return (<div onClick={() => !disabled && setOpen(!setOpen)}>
        {value ? <>
            <img src={value.logo} />
            <p>{value.name}</p>
            <p>{value.symbol}</p>
        </> :
        <>
            Select Token
        </>}
        <TokenSelectModal assets={assets} open={open} onSelect={onChange} onClose={() => setOpen(false)} value={value} />
    </div>);
}

export default TokenSelect;