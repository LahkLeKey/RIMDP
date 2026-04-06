import { FormEvent, useState } from "react";
import { useLogin } from "../hooks/useApi";

export const AuthPanel = () => {
    const loginMutation = useLogin();
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin123");

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        loginMutation.mutate({ username, password });
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
                />
                <button style={{ gridColumn: "span 2" }} type="submit">
                    {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </section>
    );
};