// App.js
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/HomePage";
import DetailsForm from "./components/DetailsForm";
import Navbar from "./components/Navbar";
import AllCards from "./components/AllCrads";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Home />
      </>
    ),
  },
  {
    path: "/create-id",
    element: (
      <>
        <Navbar />
        <DetailsForm />
      </>
    ),
  },
  {
    path:"/all-cards",
    element:(
      <>
      <Navbar/>
      <AllCards/>
      </>
    )
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
