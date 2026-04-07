import { ReactNode, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthPanel } from "./AuthPanel";
import { syncAuthSessionFromStorage, useAuthSession } from "../state/authState";

export const AppAuthGuard = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();
    const { data: session } = useAuthSession();

    useEffect(() => {
        const syncAuthState = () => syncAuthSessionFromStorage(queryClient);

        window.addEventListener("storage", syncAuthState);

        return () => {
            window.removeEventListener("storage", syncAuthState);
        };
    }, [queryClient]);

    if (!session?.token) {
        return (
            <section className="card">
                <h2>Authentication Required</h2>
                <p>Sign in to access equipment, failures, repairs, and analytics.</p>
                <AuthPanel />
            </section>
        );
    }

    return <>{children}</>;
};