import styled from "styled-components";
import {InputSubtitle} from "./Input";
import {Select} from "./Select";

type NetworkInput = {
  options: [name: string, value: string][]
  value: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
};

const NetworkInput = ({options, value, onChange}: NetworkInput) => {
  return <Container>
    <InputSubtitle>Network</InputSubtitle>
    <Select
      value={value}
      onChange={onChange}
    >
      {options.map(option =>
        <option value={option[1]}>
          {option[0]}
        </option>
      )}
    </Select>
  </Container>;
}

const Container = styled.div`

`;

export default NetworkInput;
