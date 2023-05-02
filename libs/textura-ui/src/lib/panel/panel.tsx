import React, {forwardRef} from 'react';
import './panel.scss';
import classNames from "classnames";

export type PanelProps = {
  direction?: 'row' | 'column';
  alignItems?: 'start' | 'center' | 'end';
  justifyContent?: 'start' | 'center' | 'end';
  gap?: number;
  noFlex?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const Panel = forwardRef<HTMLDivElement, PanelProps>((
  {
    direction,
    alignItems,
    justifyContent,
    gap,
    noFlex,
    ...rest
  },
  ref) => {

  const className = classNames('panel', {}, rest.className);

  // Filter out props that are not HTML attributes
  return (
    <div ref={ref} {...rest} style={{
      flexDirection: direction,
      alignItems: alignItems,
      justifyContent: justifyContent,
      flex: noFlex ? 'none' : 1,
      gap: gap,
      ...(rest.style || {}),
    }} className={className}>
      {rest.children}
    </div>
  );
});
