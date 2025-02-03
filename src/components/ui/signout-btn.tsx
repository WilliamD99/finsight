"use client";

import React, { useState } from "react";
import { Button } from "./button";
import signOutAction from "@/utils/form/actions/signOutAction";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";

export default function SignOutBtn({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleOpenChange = () => setDialogOpen(!dialogOpen);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <Button onClick={handleOpenChange} className={className} {...props}>
        {children}
      </Button>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle>Are you sure you want to sign out?</DialogTitle>
          <div className="flex flex-row justify-end space-x-3">
            <Button onClick={handleOpenChange}>Cancel</Button>
            <Button onClick={() => signOutAction()}>Sign Out</Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
