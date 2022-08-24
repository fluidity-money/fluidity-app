// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

const Icon = ({
  src,
  style,
  trigger,
}: {
  src: string;
  style?: React.CSSProperties;
  trigger?: () => void;
}) => {
  return (
    <i
      className={src}
      style={style ?? {}}
      onClick={trigger ? trigger : () => { }}
    />
  );
};

export default Icon;
