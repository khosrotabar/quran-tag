import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/home/page";
import { AxiosError } from "axios";
import { QueryClient, QueryClientProvider } from "react-query";

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
    <div className="h-screen">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={route} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
