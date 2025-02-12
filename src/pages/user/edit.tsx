import AuthGuard from "@/components/auth/AuthGuard";
import Title from "@/components/ui/Title";
import ProfileForm from "@/components/user/ProfileForm";
import style from "@/pages//user/edit.module.css";
import { Icon } from "@/components/icon/Icon";
import Link from "next/link";

function Page() {
  return (
    <div className={style["profile-edit-wrapper"]}>
      <div className={style["profile-edit-title"]}>
        <Title text="내 프로필" />
        <Link href={"/user"} className={style["form-close-button"]}>
          <Icon name="close" size={18} color={"--font-color"} />
        </Link>
      </div>
      <ProfileForm />
    </div>
  );
}

export default AuthGuard(Page, "employee");
