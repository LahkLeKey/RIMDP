import { FormEvent, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useLogin } from "../hooks/useApi";
import { clearAuthSession, useAuthSession } from "../state/authState";

export const AuthPanel = () => {
    const queryClient = useQueryClient();
    const loginMutation = useLogin();
    const { data: session } = useAuthSession();
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin123");

    const errorMessage = useMemo(() => {
        if (!loginMutation.error) {
            return null;
        }

        const axiosError = loginMutation.error as AxiosError<{ message?: string }>;
        return axiosError.response?.data?.message ?? "Login failed. Check API availability and credentials.";
    }, [loginMutation.error]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        await loginMutation.mutateAsync({ username, password });
    };

    const handleLogout = () => {
        clearAuthSession(queryClient);
        loginMutation.reset();
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
            {session?.token && (
                <div style={{ marginTop: "0.5rem" }}>
                    <p style={{ color: "#166534", margin: 0 }}>Signed in as {username}</p>
                    <p style={{ margin: "0.25rem 0", fontSize: "0.85rem" }}>
                        Token: {session.token.slice(0, 14)}...
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