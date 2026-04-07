import { FormEvent, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useApi";
import { setAuthSession } from "../state/authState";

const normalizeRedirectPath = (redirectTo?: string) => {
    if (!redirectTo || !redirectTo.startsWith("/")) {
        return "/dashboard";
    }

    return redirectTo;
};

export const AuthPanel = ({ redirectTo }: { redirectTo?: string }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const loginMutation = useLogin();
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
            const result = await loginMutation.mutateAsync({ username, password });
            setAuthSession(queryClient, result.token);
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["equipment"] }),
                queryClient.invalidateQueries({ queryKey: ["failures"] }),
                queryClient.invalidateQueries({ queryKey: ["analytics"] })
            ]);
            navigate(normalizeRedirectPath(redirectTo), { replace: true });
        } catch {
        }
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
            {loginMutation.isError && (
                <p style={{ color: "#b91c1c", marginTop: "0.5rem" }}>
                    {errorMessage}
                </p>
            )}
        </section>
    );
};