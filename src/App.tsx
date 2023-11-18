import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home/page";

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/:page=id",
      element: <Home />,
    },
  ]);
  return <RouterProvider router={route} />;
}

export default App;
