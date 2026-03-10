import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white/[0.03] backdrop-blur-xl rounded-xl border border-white/[0.06] shadow-lg shadow-black/10
        ${hover ? "hover:bg-white/[0.06] hover:border-primary-500/20 hover:shadow-primary-500/5 transition-all duration-300" : ""}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 border-b border-white/[0.06] ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-6 py-4 border-t border-white/[0.06] ${className}`}>
      {children}
    </div>
  );
}
