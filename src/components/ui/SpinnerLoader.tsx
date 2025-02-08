import style from "./SpinnerLoader.module.css";
import Image from "next/image";

const SpinnerLoader = () => {
  return (
    <div className={style.spinnerWrapper}>
      <Image src="/spinners.svg" alt="로딩 아이콘" width={100} height={100} />
    </div>
  );
};

export default SpinnerLoader;
