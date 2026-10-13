import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all focus:outline-none disabled:opacity-50';
  const variants = {
    primary: 'bg-[#005c55] text-white hover:bg-[#0f766e]',
    secondary: 'bg-[#a73a00] text-white hover:bg-[#fd651e]',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
