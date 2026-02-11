/**
 * Unit tests for InputField molecule
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InputField } from '../InputField';

describe('InputField', () => {
  it('should render with label and input', () => {
    render(
      <InputField
        label="Test Label"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should display error message when provided', () => {
    render(
      <InputField
        label="Email"
        value=""
        onChange={() => {}}
        error="Invalid email address"
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email address');
  });

  it('should call onChange handler when input changes', () => {
    const handleChange = vi.fn();
    render(
      <InputField
        label="Name"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(handleChange).toHaveBeenCalledTimes(1);

    const event = handleChange.mock.calls[0][0];
    expect(event).toHaveProperty('type', 'change');
    expect(event).toHaveProperty('target');
    expect(event.target).toBeInstanceOf(HTMLInputElement);
  });

  it('should render number input when type is number', () => {
    render(
      <InputField
        label="Amount"
        value={0}
        onChange={() => {}}
        type="number"
      />
    );

    const input = screen.getByLabelText('Amount');
    expect(input).toHaveAttribute('type', 'number');
  });
});
