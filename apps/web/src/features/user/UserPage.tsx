import { z } from 'zod';

import { AuthPanel } from '../../components/AuthPanel';
import { useLogout } from '../../hooks/useApi';
import { useAuthSession } from '../../state/authState';

const tokenPayloadSchema = z.object({
    sub: z.string().optional(),
    role: z.string().optional(),
    iat: z.number().optional(),
    exp: z.number().optional()
});

const parseTokenPayload = (token: string) => {
    const parts = token.split('.');
    if (parts.length < 2 || !parts[1]) {
        return null;
    }

    try {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
        const json = atob(padded);
        const parsed = tokenPayloadSchema.safeParse(JSON.parse(json));
        return parsed.success ? parsed.data : null;
    } catch {
        return null;
    }
};

const toDisplayDate = (epochSeconds?: number) => {
    if (!epochSeconds) {
        return '—';
    }

    return new Date(epochSeconds * 1000).toLocaleString();
};

export const UserPage = () => {
    const logoutMutation = useLogout();
    const { data: session } = useAuthSession();

    if (!session?.token) {
        return <AuthPanel />;
    }

    const payload = parseTokenPayload(session.token);

    return (
        <section className="card">
            <h2>User</h2>
            <p>Current authentication session details.</p>
            <p>
                <strong>Subject:</strong> {payload?.sub ?? 'admin-user'}
            </p>
            <p>
                <strong>Role:</strong> {payload?.role ?? 'admin'}
            </p>
            <p>
                <strong>Issued At:</strong> {toDisplayDate(payload?.iat)}
            </p>
            <p>
                <strong>Expires At:</strong> {toDisplayDate(payload?.exp)}
            </p>
            <p style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>
                <strong>Token:</strong> {session.token}
            </p>
            <button type="button" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
        </section>
    );
};