import { useRouter } from "next/router";
import style from "./Button.module.css";

interface ButtonProps {
  buttonText: string;
  disabled?: boolean;
  type?: "button" | "submit";
  size?: "small" | "medium" | "large";
  styleButton?: "primary" | "secondary"
  className?: string;
  onClick?: () => void;
  href?: string;
}

export const Button = ({ href, styleButton, size, type, buttonText, disabled, className, onClick }: ButtonProps) => {

  const router = useRouter(); // useRouter 훅 사용
  const sizeClass = style[`button_${size}`];
  const customClass = style[`button_${styleButton}`];
  const buttonClass = `${style.button} ${sizeClass} ${customClass} ${className || ""}`;

  const handleClick = () => {
    if (onClick) onClick(); // 기존 onClick 처리
    if (href) {
      router.push(href); // 버튼 클릭 시 href 경로로 이동
    }
  };

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled}
      onClick={handleClick}
    >
      {buttonText}
    </button>
  )
}

export default Button;