import { useEffect, useState } from "react";
import styles from "./Modal.module.css";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (() => void) | undefined,
  type: "alert" | "confirm" | "notice";
  text: string;
}

const Modal = ({ isOpen, onClose, onConfirm, type, text }: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={`${styles.modal_wrap} ${styles[type] || ""}`}>
      <div className={styles.modal_bg} onClick={onClose}></div>
      <div className={styles.modal}>
        {type === "alert" ? (
          <i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="12" r="12" fill="#EA3C12" />
              <path
                d="M12.6486 14.2041H11.3514L11.0676 7.33463L11 5H13L12.9324 7.33463L12.6486 14.2041ZM13 18H11.027V15.615H13V18Z"
                fill="white"
              />
            </svg>
          </i>
        ) : type === "confirm" ? (
          <i>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="12" r="12" fill="#EA3C12" />
              <path
                d="M8 12L11 15L16 9"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </i>
        ) : null}

        <p>{text}</p>
        <ul>
          {type === "alert" ? (
            <li>
              <button onClick={onClose}>확인</button>
            </li>
          ) : type === "confirm" ? (
            <>
              <li>
                <button onClick={onClose}>아니오</button>
              </li>
              <li>
                <button onClick={onConfirm}>예</button>
              </li>
            </>
          ) : (
            <li>
              <button onClick={onClose}>확인</button>
            </li>
          )}
        </ul>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
