// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React, { useEffect, useRef, useState } from "react";

// maintain cursor position based on this answer
// https://stackoverflow.com/a/68928267

interface InputProps {
  type: string;
  pholder?: string;
  output: (input: any) => void;
  theme?: string;
  style?: React.CSSProperties;
  ms?: number;
  toggle?: boolean;
  disabled?: boolean;
  value?: string;
}

// When toggle is set to true, it will check to see if the input is only numbers (using Regex)
const inputValidiation = (
  input: React.ChangeEvent<HTMLInputElement>,
  state: React.Dispatch<React.SetStateAction<string>>,
  toggle?: boolean,
) => {
  if (
    toggle &&
    /^[0-9]*\.?([0-9]*)$/.test(input.target.value) === false
  ) {
    return;
  }
  state(input.target.value);
};

const Input = ({
  type,
  pholder,
  output,
  theme,
  style = {},
  ms = 100,
  toggle,
  value,
  disabled,
  ...props
}: InputProps) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    output(input);
  }, [input]);

  const [cursor, setCursor] = useState<number | null>(null);
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const input = ref.current;
    if (input)
      input.setSelectionRange(cursor, cursor);
  }, [ref, cursor, value]);
  
  return (
    <input
      ref={ref}
      className={`input ${theme} ${disabled ? "disabled" : ""}`}
      type={type}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setCursor(e.target.selectionStart);
        inputValidiation(e, setInput, toggle);
      }}
      value={value ?? input}
      placeholder={pholder}
      style={style}
      disabled={disabled ?? false}
      {...props}
    ></input>
  );
};

export default Input;
