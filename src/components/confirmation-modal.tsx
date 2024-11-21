import { useEffect } from "react";
import { Button, ButtonProps } from "./ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "./ui/modal";

export type ConfirmationModalProps = {
  open: boolean;
  onOpenChange: () => void;
  title: string;
  description: string;
  components?: React.ReactNode[];
  buttons: {
    text: string;
    onClick: () => void;
    variant: ButtonProps["variant"];
  }[];
};

function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  components,
  buttons,
}: ConfirmationModalProps) {
  useEffect(() => {
    console.log(open);
  }, [open]);
  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
          <ResponsiveModalDescription>{description}</ResponsiveModalDescription>
        </ResponsiveModalHeader>
        {components &&
          components?.length > 0 &&
          components.map((component, index) => (
            <div key={index}>{component}</div>
          ))}
        <ResponsiveModalFooter>
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              variant={button.variant}
            >
              {button.text}
            </Button>
          ))}
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}

export default ConfirmationModal;
