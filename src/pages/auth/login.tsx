import LoginForm from "@/components/auth/LoginForm";
import style from "@/pages/auth/auth.module.css";

export default function Page() {
  return (
    <div className={style["auth-container"]}>
      <LoginForm />
    </div>
  );
}
