import Alerts from "@/components/alerts/Alerts";
import style from "./Sol.module.css";
import { Icon } from "@/components/icon/Icon";

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
          <div className={style.box}></div>
        </li>
        <li>
          <h3>Icon</h3>
          <div>
            <p>1️⃣아이콘명 : {`<Icon name="camera" />`}</p>
            <p>2️⃣사이즈 : {`<size=16 />`}</p>
            <p>
              3️⃣색상 : {`<color="red-400" />`}, {`<color="#e7e7e7" />`} → 색상 변수, 색상 코드 둘 다
              사용 가능
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
      </ul>
    </div>
  );
};

export default Sol;
