import { FormEvent, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useLogin, useLogout } from "../hooks/useApi";
import { useAuthSession } from "../state/authState";

const normalizeRedirectPath = (redirectTo?: string) => {
    if (!redirectTo || !redirectTo.startsWith("/")) {
        return "/dashboard";
    }

    return redirectTo;
};

export const AuthPanel = ({ redirectTo }: { redirectTo?: string }) => {
    const navigate = useNavigate();
    const loginMutation = useLogin();
    const logoutMutation = useLogout();
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
        loginMutation.reset();
        try {
            await loginMutation.mutateAsync({ username, password });
            navigate(normalizeRedirectPath(redirectTo), { replace: true });
        } catch {
        }
    };

    const handleLogout = () => {
        logoutMutation.mutate();
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
                <button style={{ gridColumn: "span 2" }} type="submit" disabled={loginMutation.isPending || logoutMutation.isPending}>
                    {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </button>
            </form>
            {session?.token && (
                <div style={{ marginTop: "0.5rem" }}>
                    <p style={{ color: "#166534", margin: 0 }}>Signed in as {username}</p>
                    <p style={{ margin: "0.25rem 0", fontSize: "0.85rem" }}>
                        Token: {session.token.slice(0, 14)}...
                    </p>
                    <button type="button" onClick={handleLogout} disabled={logoutMutation.isPending}>
                        {logoutMutation.isPending ? "Signing out..." : "Sign out"}
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