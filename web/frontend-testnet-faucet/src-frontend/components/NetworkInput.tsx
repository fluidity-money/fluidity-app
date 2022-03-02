import styled from "styled-components";
import {InputSubtitle} from "./Input";
import {Select} from "./Select";

type NetworkInput = {
  options: Record<string, [fullName: string, defaultAddress: string, tokenName: string]>,
  value: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
};

const NetworkInput = ({options, value, onChange}: NetworkInput) =>
  <Container>
    <InputSubtitle>Network</InputSubtitle>
    <Select
      value={value}
      onChange={onChange}
    >
      { Object.keys(options).map(key =>
        <option value={key}>
          {options[key][0]}
        </option>
      ) }
    </Select>
  </Container>;

const Container = styled.div`

`;

export default NetworkInput;
