import { ReactNode, useEffect, useState } from "react";
import { AuthPanel } from "./AuthPanel";

const AUTH_STATE_EVENT = "rimdp-auth-changed";

const readToken = () => localStorage.getItem("rimdp_token");

export const AppAuthGuard = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => readToken());

    useEffect(() => {
        const syncAuthState = () => {
            setToken(readToken());
        };

        window.addEventListener("storage", syncAuthState);
        window.addEventListener(AUTH_STATE_EVENT, syncAuthState);

        return () => {
            window.removeEventListener("storage", syncAuthState);
            window.removeEventListener(AUTH_STATE_EVENT, syncAuthState);
        };
    }, []);

    if (!token) {
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