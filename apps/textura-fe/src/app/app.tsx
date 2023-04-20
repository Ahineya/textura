// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from "./app.module.scss";

import NxWelcome from "./nx-welcome";

import { Route, Routes, Link } from "react-router-dom";
import {Layout} from "./components/pages/layout";
import {MainPage} from "./components/pages/main/main-page";

export function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Layout />}
        >
          <Route index element={<MainPage/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
