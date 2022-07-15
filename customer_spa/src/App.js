import React from "react";

import "./styles/general/App.css";

import Routes from "./components/general/routes/Route";
import {BrowserRouter} from "react-router-dom";

function App() {
  return (
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
  );
}

export default App;
