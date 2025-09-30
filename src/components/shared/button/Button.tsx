import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  icon,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = clsx({
    'btn-primary': variant === 'primary',
    'btn-secondary': variant === 'secondary',
    'btn-danger': variant === 'danger',
    'btn-disabled': disabled,
  });

  const widthClass = fullWidth ? 'w-full' : 'w-auto';

  return (
    <button
      className={clsx(baseClasses, variantClasses, widthClass, className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
