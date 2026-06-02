import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RequestForm } from '../components/forms/RequestForm';

describe('RequestForm', () => {
  it('shows validation errors when required fields are missing', async () => {
    render(<RequestForm onSubmit={vi.fn() as any} />);

    fireEvent.click(screen.getByRole('button', { name: /submit request/i }));

    expect(await screen.findByText(/title must be at least 5 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    expect(screen.getByText(/department is required/i)).toBeInTheDocument();
  });
});
