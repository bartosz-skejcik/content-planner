import { createContext, useCallback, useContext, useState } from "react";
import { ButtonProps } from "@/components/ui/button";
import ConfirmationModal from "@/components/confirmation-modal";

// Types for form state management
type FormState = Record<string, any>;

type ConfirmationModalContextType = {
  isOpen: boolean;
  title: string;
  description: string;
  components?: ((
    formState: FormState,
    setFormState: (key: string, value: any) => void,
  ) => React.ReactNode)[];
  formState: FormState;
  buttons: {
    text: string;
    onClick: (formState: FormState) => void; // Updated to include formState parameter
    variant: ButtonProps["variant"];
  }[];
  showModal: (props: ShowModalProps) => void;
  hideModal: () => void;
  setFormValue: (key: string, value: any) => void;
  getFormValue: (key: string) => any;
};

type ShowModalProps = Omit<
  ConfirmationModalContextType,
  | "isOpen"
  | "showModal"
  | "hideModal"
  | "formState"
  | "setFormValue"
  | "getFormValue"
>;

// Create the context
const ConfirmationModalContext = createContext<
  ConfirmationModalContextType | undefined
>(undefined);

// Provider component
export function ConfirmationModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modalState, setModalState] = useState<
    Omit<
      ConfirmationModalContextType,
      "showModal" | "hideModal" | "setFormValue" | "getFormValue"
    >
  >({
    isOpen: false,
    title: "",
    description: "",
    components: [],
    formState: {},
    buttons: [],
  });

  const setFormValue = useCallback((key: string, value: any) => {
    setModalState((prev) => ({
      ...prev,
      formState: {
        ...prev.formState,
        [key]: value,
      },
    }));
  }, []);

  const getFormValue = useCallback(
    (key: string) => {
      return modalState.formState[key];
    },
    [modalState.formState],
  );

  const showModal = useCallback((props: ShowModalProps) => {
    setModalState({
      isOpen: true,
      formState: {}, // Reset form state when showing new modal
      ...props,
    });
  }, []);

  const hideModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      isOpen: false,
      formState: {}, // Clear form state when hiding
    }));
  }, []);

  // Create wrapped buttons that include formState in onClick
  const wrappedButtons = modalState.buttons.map((button) => ({
    ...button,
    onClick: () => button.onClick(modalState.formState),
  }));

  return (
    <ConfirmationModalContext.Provider
      value={{
        ...modalState,
        showModal,
        hideModal,
        setFormValue,
        getFormValue,
      }}
    >
      {children}
      <ConfirmationModal
        open={modalState.isOpen}
        onOpenChange={hideModal}
        title={modalState.title}
        description={modalState.description}
        components={modalState.components?.map((ComponentFn) =>
          ComponentFn(modalState.formState, setFormValue),
        )}
        buttons={wrappedButtons}
      />
    </ConfirmationModalContext.Provider>
  );
}

// Custom hook
export function useConfirmationModal() {
  const context = useContext(ConfirmationModalContext);
  if (context === undefined) {
    throw new Error(
      "useConfirmationModal must be used within a ConfirmationModalProvider",
    );
  }
  return context;
}
