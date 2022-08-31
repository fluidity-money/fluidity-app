// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

const FormSection = ({
  children,
  cname,
  defaultMargin,
  onClickHandler,
}: {
  children?: JSX.Element | JSX.Element[];
  cname?: string;
  defaultMargin?: boolean;
  onClickHandler?: () => void;
}) => {
  return (
    <div
      className={`${cname ?? ""} ${
        defaultMargin === false ? "" : "swap-field-margin"
      }`}
      onClick={onClickHandler}
    >
      {children}
    </div>
  );
};

export default FormSection;
