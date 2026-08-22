"use client";

import { useState } from "react";
import ContactModal from "@/components/ContactModal";

type ContactModalButtonProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function ContactModalButton({
  className = "",
  children = "İletişim",
}: ContactModalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {children}
      </button>

      <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
