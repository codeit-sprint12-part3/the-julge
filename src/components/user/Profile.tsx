import { Icon } from "@/components/icon/Icon";
import Button from "../ui/Button";
import style from "@/components/user/Profile.module.css";

export interface UserInfo {
  id: string;
  email: string;
  type: "employee" | "employer";
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export interface ProfileProps {
  userInfo: UserInfo;
}

const Profile = (userInfo: ProfileProps) => {
  return (
    <div className={style["profile-wrapper"]}>
      <div className={style["profile-contents"]}>
        <strong>이름</strong>
        <h4>{userInfo.userInfo.name}</h4>
        <ul>
          <li>
            <Icon name={"phone"} size={20} color={"--red-300"} />
            <span>{userInfo.userInfo.phone}</span>
          </li>
          <li>
            <Icon name={"map"} size={20} color={"--red-300"} />
            <span>선호 지역 : {userInfo.userInfo.address}</span>
          </li>
        </ul>
        <p>{userInfo.userInfo.bio}</p>
      </div>
      <div className={style["profile-button"]}>
        <Button
          href="/user/edit"
          buttonText="편집하기"
          type="button"
          size="medium"
          styleButton="secondary"
        />
      </div>
    </div>
  );
};

export default Profile;
