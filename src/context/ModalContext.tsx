import { createContext, ReactNode, useContext, useState } from "react";
import Modal from "@/components/ui/Modal";
import { enableScrollLock, disableScrollLock } from "@/lib/scrollLock";

interface ModalContextType {
  openModal: (type: "alert" | "confirm" | "notice", text: string, onConfirm?: () => void) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"alert" | "confirm" | "notice">("alert");
  const [modalText, setModalText] = useState("");
  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>(undefined);

  const openModal = (
    type: "alert" | "confirm" | "notice",
    text: string,
    confirmAction?: () => void
  ) => {
    setModalType(type);
    setModalText(text);
    setOnConfirm(() => confirmAction);
    setIsOpen(true);
    enableScrollLock();
  };

  const closeModal = () => {
    setIsOpen(false);
    disableScrollLock();
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        isOpen={isOpen}
        onConfirm={onConfirm}
        onClose={closeModal}
        type={modalType}
        text={modalText}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal은 반드시 ModalProvider 안에서 사용되어야 합니다.");
  return context;
};
