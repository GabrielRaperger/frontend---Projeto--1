import React from "react";
import "./index.css";
import App from "./main/App";
import { createRoot } from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./config/axios";
import { Provider } from "react-redux";
import configStore from "./store/storeConfig";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
const store = configStore();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  rootElement
);

reportWebVitals();
