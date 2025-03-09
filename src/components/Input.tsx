import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = '', ...rest }, ref) => {
    return (
      <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-gray-700 font-medium mb-1">{label}</label>
        )}
        <input
          ref={ref}
          className={`
            px-3 py-2 border rounded-md w-full 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 
            ${error ? 'border-red-500' : 'border-gray-300'} 
            ${className}
          `}
          {...rest}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 