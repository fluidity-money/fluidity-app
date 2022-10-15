import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { ToolContext } from './toolContext';
import { ToolTip } from './toolTip';

export const ToolProvider = (props :any) => {
  const [toolTips, setToolTips] = useState<{id: string, content: any}[]>([]);
  const open = (content: any) => {
    return setToolTips((currentToasts) => [
      ...currentToasts,
      { id: String(Date.now()), content },
    ]);
  }
    
  const close = (id :string) =>
    setToolTips((currentToasts) =>
      currentToasts.filter((toolTip) => toolTip.id !== id)
    );

  const contextValue = useMemo(() => ({ open }), []);

  return (
    <ToolContext.Provider value={contextValue}>
      {props.children}

      {createPortal(
        <div className="tooltip_container">
          {toolTips.map((item) => (
            <ToolTip key={item.id} close={() => close(item.id)}>
              {item.content}
            </ToolTip>
          ))}
        </div>,
        document.body
      )}
    </ToolContext.Provider>
  );
};