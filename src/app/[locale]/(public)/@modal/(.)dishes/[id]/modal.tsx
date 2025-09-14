"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";

const Modal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) router.back();
      }}
    >
      <DialogContent className="lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only" />
          <DialogDescription className="sr-only" />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
export default Modal;
