import React, {FC} from 'react';
import TwoColumnsLayout from "../../ui/two-columns-layout";
import './main-page.scss';
import {Viewer} from "./viewer/viewer";
import {Editor} from "./editor/editor";

export const MainPage: FC = () => {
  return (
    <div className="main-page">
      <TwoColumnsLayout left={<Viewer/>} right={<Editor/>}/>
    </div>
  );
}
