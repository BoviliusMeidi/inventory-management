import Image from "next/image";
interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <>
      <Image
        src="/logo-BM.svg"
        width={60}
        height={30}
        alt="Logo BM"
        className="block w-24 sm:hidden"
      />
      <h1 className="font-bold text-2xl sm:text-4xl text-center">{title}</h1>
      <p className="opacity-70 text-center">{subtitle}</p>
    </>
  );
}
