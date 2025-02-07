import style from "./SkeletonLoader.module.css";
import Image from "next/image";

const SkeletonLoader = () => {
  return (
    <div className={style.skeletonWrapper}>
      <Image src="/spinners.svg" alt="로딩 아이콘" width={100} height={100} />
    </div>
  );
};

export default SkeletonLoader;
