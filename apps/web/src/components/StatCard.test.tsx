import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StatCard } from './StatCard';

describe('StatCard', () => {
    it('renders label and value', () => {
        render(<StatCard label="Total Equipment" value="12" />);

        expect(screen.getByText('Total Equipment')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 2, name: '12' }))
            .toBeInTheDocument();
    });
});