import Link from 'next/link';

interface AuthFooterProps {
  description: string;
  linkText: string;
  linkHref: string;
}

export function AuthFooter({ description, linkText, linkHref }: AuthFooterProps) {
  return (
    <div className="flex gap-2">
      <p className="opacity-70">{description}</p>
      <p>
        <Link href={linkHref} className="text-blue-700">
          {linkText}
        </Link>
      </p>
    </div>
  );
}