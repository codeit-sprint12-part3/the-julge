import style from "./Button.module.css";

interface ButtonProps {
  buttonText: string;
  disabled?: boolean;
  type?: "button" | "submit";
  size?: "small" | "medium" | "large";
  styleButton?: "primary" | "secondary"
  className?: string;
  onClick?: () => void;
}

export const Button = ({ styleButton, size, type, buttonText, disabled, className, onClick }: ButtonProps) => {

  const sizeClass = style[`button_${size}`];
  const customClass = style[`button_${styleButton}`];
  const buttonClass = `${style.button} ${sizeClass} ${customClass} ${className || ""}`;

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
    >
      {buttonText}
    </button>
  )
}

export default Button;