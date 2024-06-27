"use client";
import { useRouter } from 'next/navigation';

export interface ButtonProps {
  children: string;
  path?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({ children, path = '', className = '', disabled, onClick }: ButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(path);
    }
  };

  return (
    <button
      type="button"
      className={`rounded-full bg-white/10 px-4 py-2 font-semibold transition hover:bg-white/20 ${className}`}
      onClick={handleClick}
      disabled={disabled} // Set disabled attribute conditionally
    >
      {children}
    </button>
  );
}

export interface MyPageProps {
  pageType?: string; // Optional parameter for dynamic content
}

export default Button;