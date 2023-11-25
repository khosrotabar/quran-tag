import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { AxiosError } from "axios";
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

  const useErrorBoundary = (error: unknown) => {
    return Boolean(
      error instanceof AxiosError &&
        error.response &&
        error.response?.status >= 500,
    );
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        useErrorBoundary,
        refetchOnWindowFocus: false,
      },
      mutations: {
        useErrorBoundary,
      },
    },
  });

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={route} />
      </QueryClientProvider>
      ;
    </div>
  );
}

export default App;
