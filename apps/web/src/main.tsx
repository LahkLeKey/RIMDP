import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { initializeAuthSession } from "./state/authState";
import "./styles.css";

const queryClient = new QueryClient();
initializeAuthSession(queryClient);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider
                router={router}
                future={{
                    v7_startTransition: true,
                }}
            />
        </QueryClientProvider>
    </React.StrictMode>
);