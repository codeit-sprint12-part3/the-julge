import Alerts from "@/components/alerts/Alerts";
import style from "./Sol.module.css";
import { Icon } from "@/components/icon/Icon";
import Logo from "@/components/ui/Logo";
import Badge from "@/components/ui/Badge";

const Sol = () => {
  return (
    <div className={style.wrapper}>
      <ul>
        <li>
          <h3>Alerts</h3>
          <div className={style.box}>
            <Alerts />
          </div>
        </li>
        <li>
          <h3>Logo</h3>
          <div>
            <p>1️⃣width? = {`{248}`}</p>
            <p>2️⃣height? = {`{45}`}</p>
          </div>
          <div className={style.box}>
            <Logo />
          </div>
        </li>
        <li>
          <h3>Icon</h3>
          <div>
            <p>
              1️⃣name ={" "}
              {`"alter | camera | check | warn | map | time | phone | mail | facebook | instargram | search | close | selectUp | selectDown | leftArr | rightArr | upArr "`}
            </p>
            <p>2️⃣size? = {`{24}`}</p>
            <p>
              3️⃣color? = {`{"--green-200"}`} → 색상 변수, {`{"#f5f5f5"}`} → 색상 코드 둘 다 사용
              가능
            </p>
          </div>
          <div className={style.box}>
            <Icon name="alter" size={24} />
            <Icon name="camera" />
            <Icon name="check" />
            <Icon name="warn" />
            <Icon name="map" />
            <Icon name="time" />
            <Icon name="phone" />
            <Icon name="mail" />
            <Icon name="facebook" />
            <Icon name="instargram" />
            <Icon name="search" />
            <Icon name="close" />
            <Icon name="selectUp" />
            <Icon name="selectDown" />
            <Icon name="leftArr" />
            <Icon name="rightArr" />
            <Icon name="upArr" />
          </div>
        </li>
        <li>
          <h3>Badge</h3>
          <div>
            <p>type = {`" pending | accepted | rejected | canceled | increased "`}</p>
            <p>hourlyPay? = {`{ 14000 }`} → 공고 시급</p>
            <p>originalHourlyPay? = {`{ 14000 }`} → 기존 시급</p>
            <p>state? = {`"done"`} → 마감 완료 상태일 때</p>
          </div>
          <div className={style.box}>
            <Badge type="pending" />
            <Badge type="accepted" />
            <Badge type="rejected" />
            <Badge type="canceled" />
            <Badge type="increased" hourlyPay={14000} originalHourlyPay={10000} />
            <Badge type="increased" hourlyPay={14000} originalHourlyPay={10000} state="done" />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sol;
