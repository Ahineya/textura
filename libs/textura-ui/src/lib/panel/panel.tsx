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

export const Panel = forwardRef<HTMLDivElement, PanelProps>((props, ref) => {

  const className = classNames('panel', {
  }, props.className);

  return (
    <div ref={ref} {...props} style={{
      flexDirection: props.direction,
      alignItems: props.alignItems,
      justifyContent: props.justifyContent,
      flex: props.noFlex ? 'none' : 1,
      gap: props.gap,
      ...(props.style || {}),
    }} className={className}>
      {props.children}
    </div>
  );
});
