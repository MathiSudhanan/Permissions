import React from "react";
// import ReactDOM  from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import { createBrowserHistory } from "history";
import { myHistory } from "./api/history";

import { Provider } from "react-redux";
import { store } from "../src/store/configureStore";
import { HistoryRouter } from "./api/HistoryRouter";
// ReactDOM.render(<App/>,document.getElementById('root'));
// import "./styles/site.css";
export const history = createBrowserHistory();
const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  // <React.StrictMode>
  <HistoryRouter history={myHistory}>
    <Provider store={store}>
      <App /*tab="home" */ />
    </Provider>
  </HistoryRouter>
  // </React.StrictMode>
);
