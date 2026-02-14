import { X } from "phosphor-react-native";
import React from "react";
import { Button, Dialog, DialogContentProps, Unspaced } from "tamagui";

type CustomDialogProps = {
  id: string;
  open: boolean;
  trigger: React.ReactNode;
  children: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  dialogContentProps?: DialogContentProps;
};

export default function CustomDialog({
  id,
  open,
  setOpen,
  trigger,
  children,
  dialogContentProps,
}: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal key={`portal-${id}`} mx={10}>
        <Dialog.Overlay
          bg={"rgba(0, 0, 0, 0.60)"}
          backdropFilter={"blur(5px)"}
        />

        <Dialog.Content
          p={24}
          rounded={20}
          width={"100%"}
          bg={"#0C0D11"}
          key={`content-${id}`}
          border={"1px solid #27272A"}
          {...dialogContentProps}
        >
          {children}

          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                r="$4"
                t={"$4"}
                size="$4"
                circular
                bg={"transparent"}
                icon={<X color="white" />}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
