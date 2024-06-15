import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/Login";
import Task from "./components/Task";
import Comments from "./components/Comments";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/task",
    element: <Task />,
  },
  {
    path: "/comments",
    element: <Comments />,
  },
  {
    path: "/comments/:category/:id",
    element: <Comments />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
