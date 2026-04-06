import { FormEvent, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { setAuthToken } from "../api/client";
import { useLogin } from "../hooks/useApi";

const AUTH_STATE_EVENT = "rimdp-auth-changed";

export const AuthPanel = () => {
    const loginMutation = useLogin();
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin123");
    const [sessionToken, setSessionToken] = useState<string | null>(() => localStorage.getItem("rimdp_token"));

    const errorMessage = useMemo(() => {
        if (!loginMutation.error) {
            return null;
        }

        const axiosError = loginMutation.error as AxiosError<{ message?: string }>;
        return axiosError.response?.data?.message ?? "Login failed. Check API availability and credentials.";
    }, [loginMutation.error]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const result = await loginMutation.mutateAsync({ username, password });
            setSessionToken(result.token);
        } catch {
            setSessionToken(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("rimdp_token");
        setAuthToken(null);
        setSessionToken(null);
        loginMutation.reset();
        window.dispatchEvent(new Event(AUTH_STATE_EVENT));
    };

    return (
        <section className="card">
            <h3>API Login</h3>
            <form className="form-grid" onSubmit={handleSubmit}>
                <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" />
                <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    type="password"
                    autoComplete="current-password"
                />
                <button style={{ gridColumn: "span 2" }} type="submit" disabled={loginMutation.isPending}>
                    {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </button>
            </form>
            {sessionToken && (
                <div style={{ marginTop: "0.5rem" }}>
                    <p style={{ color: "#166534", margin: 0 }}>Signed in as {username}</p>
                    <p style={{ margin: "0.25rem 0", fontSize: "0.85rem" }}>
                        Token: {sessionToken.slice(0, 14)}...
                    </p>
                    <button type="button" onClick={handleLogout}>
                        Sign out
                    </button>
                </div>
            )}
            {loginMutation.isError && (
                <p style={{ color: "#b91c1c", marginTop: "0.5rem" }}>
                    {errorMessage}
                </p>
            )}
        </section>
    );
};