import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";

import { ToolContext } from "./ToolContext";
import { ToolTip } from "./ToolTip";

export const ToolProvider = (props: { children: React.ReactNode }) => {
  const [toolTips, setToolTips] = useState<
    { id: string; bgColor: string; content: React.ReactNode }[]
  >([]);

  const [portalElement, setPortalElement] = useState<HTMLElement>();

  useEffect(() => {
    setPortalElement(document.body);
  });

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

      {portalElement &&
        createPortal(
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
          portalElement
        )}
    </ToolContext.Provider>
  );
};
