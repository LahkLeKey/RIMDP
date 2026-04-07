import { ReactNode, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { AuthPanel } from "./AuthPanel";
import { AUTH_SESSION_UPDATED_EVENT, syncAuthSessionFromStorage, useAuthSession } from "../state/authState";

export const AppAuthGuard = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const { data: session } = useAuthSession();

    const intendedPath = `${location.pathname}${location.search}${location.hash}`;

    useEffect(() => {
        const syncAuthState = () => syncAuthSessionFromStorage(queryClient);

        window.addEventListener("storage", syncAuthState);
        window.addEventListener(AUTH_SESSION_UPDATED_EVENT, syncAuthState);

        return () => {
            window.removeEventListener("storage", syncAuthState);
            window.removeEventListener(AUTH_SESSION_UPDATED_EVENT, syncAuthState);
        };
    }, [queryClient]);

    if (!session?.token) {
        return (
            <section className="card">
                <h2>Authentication Required</h2>
                <p>Sign in to access equipment, failures, repairs, and analytics.</p>
                <AuthPanel redirectTo={intendedPath} />
            </section>
        );
    }

    return <>{children}</>;
};