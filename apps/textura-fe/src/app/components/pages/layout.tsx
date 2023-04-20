import React, {FC} from 'react';
import { Outlet } from 'react-router-dom';
import './layout.scss';

export const Layout: FC = () => {
  return (
    <div className="layout">
      <Outlet />
    </div>
  );
}
