import React, {FC} from 'react';
import './button.scss';
import classNames from "classnames";

export type ButtonProps = {
  padded?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({
  padded,
  ...props
                                        }) => {

  const className = classNames('button', {
    'button-padded': padded,
  }, props.className);

  return (
    <button {...props} className={className}>
      {props.children}
    </button>
  );
}
