import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";

import { ToolContext } from "./ToolContext";
import { ToolTip } from "./ToolTip";

export const ToolProvider = (props: {
  children: React.ReactElement<string>;
}) => {
  const [toolTips, setToolTips] = useState<
    { id: string; bgColor: string; content: React.ReactNode }[]
  >([]);

  const open = (bgColor: string, content: React.ReactNode) => {
    return setToolTips((currentTooltip) => [
      ...currentTooltip,
      { id: String(Date.now()), content, bgColor },
    ]);
  };

  const close = (id: string) =>
    setToolTips((currentTooltip) =>
      currentTooltip.filter((toolTip) => toolTip.id !== id)
    );

  const contextValue = useMemo(() => ({ open }), []);

  return (
    <ToolContext.Provider value={contextValue}>
      {props.children}

      {createPortal(
        <div className="tooltip_container">
          {toolTips.map((item) => (
            <ToolTip
              key={item.id}
              bgColor={item.bgColor}
              close={() => close(item.id)}
            >
              {item.content}
            </ToolTip>
          ))}
        </div>,
        document.body
      )}
    </ToolContext.Provider>
  );
};
