// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { appTheme } from "util/appTheme";

interface FormSectionProps extends React.ComponentPropsWithoutRef<"div"> {
  children?: JSX.Element | JSX.Element[];
  cname?: string;
  defaultMargin?: boolean;
  onClickHandler?: () => void;
}
const FormSection = ({
  children,
  cname,
  defaultMargin,
  onClickHandler,
  ...props
}: FormSectionProps) => {
  return (
    <div
      className={`${cname ?? ""} ${
        defaultMargin === false ? "" : `swap-field-margin${appTheme} `
      }`}
      onClick={onClickHandler}
      {...props}
    >
      {children}
    </div>
  );
};

export default FormSection;
