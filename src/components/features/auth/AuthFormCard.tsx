import Image from "next/image";

interface AuthFormCardProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthFormCard({ header, children, footer }: AuthFormCardProps) {
  return (

      <div className="flex flex-col items-center justify-center h-screen gap-4 sm:gap-4 p-8">
        <Image
          src="/logo-BM.svg"
          width={60}
          height={30}
          alt="Logo BM"
          className="block w-24 sm:hidden"
        />
        {header}
        {children}
        {footer}
      </div>
  );
}
