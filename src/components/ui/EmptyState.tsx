import Link from "next/link";
import style from "@/components/ui/EmptyState.module.css";
import Button from "./Button";

interface EmptyStateProps {
  message: string;
  buttonText?: string;
  href?: string;
  lineStyle?: "white" | "black";
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, buttonText, href, lineStyle }) => {
  return (
    <div className={`${style["empty-wrapper"]} ${lineStyle ? style[lineStyle] : ""}`}>
      <p className={style["empty-message"]}>{message}</p>
      {buttonText && href && (
        <Link href={href}>
          <Button buttonText={buttonText} type="button" size="large" styleButton="primary" />
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
