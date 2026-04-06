import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SimpleBarChart } from './SimpleBarChart';

describe('SimpleBarChart', () => {
    it('renders title and data labels', () => {
        render(
            <SimpleBarChart
                title="Failure Trend"
                data={[{ label: 'Mon', value: 2 }, { label: 'Tue', value: 4 }]}
            />);

        expect(screen.getByRole('heading', { name: 'Failure Trend' }))
            .toBeInTheDocument();
        expect(screen.getByText('Mon')).toBeInTheDocument();
        expect(screen.getByText('Tue')).toBeInTheDocument();
    });

    it('applies correct relative bar widths', () => {
        const { container } = render(
            <SimpleBarChart
                title="Relative Width"
                data={[{ label: 'A', value: 1 }, { label: 'B', value: 2 }]}
            />);

        const bars = container.querySelectorAll('.chart-bar');
        expect(bars).toHaveLength(2);
        expect(bars[0]?.getAttribute('style')).toContain('50%');
        expect(bars[1]?.getAttribute('style')).toContain('100%');
    });
});