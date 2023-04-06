import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AiCanvas from "./AiCanvas";
import App from "./App";
import "./index.css";
import { Notifications } from "@mantine/notifications";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/edit",
    element: <AiCanvas />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider>
      <Notifications position='bottom-center'/>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
