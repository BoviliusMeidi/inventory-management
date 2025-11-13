import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row items-center justify-around h-screen">
      <Image
        src="/logo-BM.svg"
        width={300}
        height={200}
        alt="Logo BM"
        className="hidden sm:block"
      />

      {children}
    </div>
  );
}
