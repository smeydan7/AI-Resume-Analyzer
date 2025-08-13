import { Link } from 'react-router-dom';
import type { ReactNode, MouseEventHandler } from 'react';
import cls from './Button.module.css';

interface ButtonProps {
    children: ReactNode;
    to?: string;
    type?: 'button' | 'submit' | 'reset';
    onClick?: MouseEventHandler<HTMLButtonElement>;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md';
    className?: string;
    disabled?: boolean;
}

export const Button = ({
    children,
    to,
    type = 'button',
    onClick,
    variant = 'secondary',
    size = 'md',
    className = '',
    disabled = false,
}: ButtonProps) => {
    const classes = `${cls.base} ${cls[size]} ${cls[variant]} ${className}`;

    if (to) {
        return (
            <Link to={to} className={classes} aria-disabled={disabled} onClick={(e) => disabled && e.preventDefault()}>
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className={classes} disabled={disabled}>
            {children}
        </button>
    );
}; 