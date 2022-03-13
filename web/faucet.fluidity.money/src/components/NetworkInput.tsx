import styled from "styled-components";
import {NetworkInputOptions} from "../App";
import {SupportedNetworks} from "../util";
import {InputSubtitle} from "./Input";
import {Select} from "./Select";

type NetworkInput = {
  options: NetworkInputOptions
  value: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
};

type CurrencyInput = Omit<NetworkInput, 'options'> & {
  options: NetworkInputOptions[keyof NetworkInputOptions][2]
  children?: React.ReactNode
}

const NetworkInput = ({options, value, onChange}: NetworkInput) =>
  <Container>
    <InputSubtitle>Network</InputSubtitle>
    <Select
      value={value}
      onChange={onChange}
    >
      { Object.keys(options).map(key =>
        <option value={key}>
          {options[key as SupportedNetworks][0]}
        </option>
        )}
      </Select>
  </Container>;

const Container = styled.div<{currency?: boolean}>`
  width: ${p => p.currency ? "100%" : "auto"}
`;

const SelectContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const CurrencyInput = ({options, value, onChange, children}: CurrencyInput) =>
  <Container currency>
    <InputSubtitle>Request Type</InputSubtitle>
    <SelectContainer>
      <Select
        value={value}
        onChange={onChange}
      >
        {options.map(key =>
          <option value={key}>
            {key}
          </option>
        )}
      </Select>
      {children}
    </SelectContainer>
  </Container>;

export default NetworkInput;
