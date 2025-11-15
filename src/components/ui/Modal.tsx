"use client";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center h-full items-start p-4 bg-black/30 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="flex flex-col justify-center w-full max-w-xl mx-auto p-6 mt-10 mb-10 bg-white border border-gray-300 rounded-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        </div>
        <div className="flex flex-col gap-5">{children}</div>
        <div className="flex justify-end items-center mt-4 gap-4">
          {footer}
        </div>
      </div>
    </div>
  );
}