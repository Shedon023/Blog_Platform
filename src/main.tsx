import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { RouterProvider } from "./app/Providers.ts/RouterProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider>
      <App />
    </RouterProvider>
  </QueryClientProvider>
);
