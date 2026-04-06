import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthPanel } from './AuthPanel';

const mutateAsyncMock = vi.fn();
const resetMock = vi.fn();
let isPendingState = false;
const storage: Record<string, string> = {};

vi.mock('../hooks/useApi', () => ({
    useLogin: () => ({
        mutateAsync: mutateAsyncMock,
        isPending: isPendingState,
        isError: false,
        error: null,
        reset: resetMock
    })
}));

describe('AuthPanel', () => {
    beforeEach(() => {
        Object.keys(storage).forEach((key) => delete storage[key]);
        Object.defineProperty(globalThis, 'localStorage', {
            configurable: true,
            value: {
                getItem: (key: string) => storage[key] ?? null,
                setItem: (key: string, value: string) => {
                    storage[key] = value;
                },
                removeItem: (key: string) => {
                    delete storage[key];
                },
                clear: () => {
                    Object.keys(storage).forEach((key) => delete storage[key]);
                }
            }
        });
        mutateAsyncMock.mockReset();
        resetMock.mockReset();
        isPendingState = false;
    });

    it('renders login fields and default values', () => {
        render(<AuthPanel />);

        const username = screen.getByPlaceholderText('Username') as HTMLInputElement;
        const password = screen.getByPlaceholderText('Password') as HTMLInputElement;

        expect(username.value).toBe('admin');
        expect(password.value).toBe('admin123');
        expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    });

    it('submits updated credentials through login mutation and shows signed-in state', async () => {
        mutateAsyncMock.mockResolvedValue({ token: 'test-token-12345' });
        render(<AuthPanel />);

        fireEvent.change(screen.getByPlaceholderText('Username'), {
            target: { value: 'operator' }
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'secure' }
        });
        fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }));

        expect(mutateAsyncMock).toHaveBeenCalledWith({ username: 'operator', password: 'secure' });
        expect(await screen.findByText('Signed in as operator')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
    });

    it('shows pending label when login mutation is in progress', () => {
        isPendingState = true;
        render(<AuthPanel />);

        expect(screen.getByRole('button', { name: 'Signing in...' }))
            .toBeInTheDocument();
    });

    it('clears local session state when signing out', async () => {
        mutateAsyncMock.mockResolvedValue({ token: 'test-token-67890' });
        render(<AuthPanel />);

        fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }));
        expect(await screen.findByRole('button', { name: 'Sign out' })).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));

        expect(screen.queryByText(/Signed in as/)).not.toBeInTheDocument();
        expect(resetMock).toHaveBeenCalled();
    });
});