interface AuthFormCardProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthFormCard({ header, children, footer }: AuthFormCardProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 sm:gap-4 p-8">
      {header}
      {children}
      {footer}
    </div>
  );
}
