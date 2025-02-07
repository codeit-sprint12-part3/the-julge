import SignupForm from "@/components/auth/SignupForm";
import style from "@/pages/auth/auth.module.css";

export default function Page() {
  return (
    <div className={style["auth-container"]}>
      <SignupForm />
    </div>
  );
}
