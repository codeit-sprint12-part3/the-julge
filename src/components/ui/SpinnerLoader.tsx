import style from "./SpinnerLoader.module.css";
import Image from "next/image";

interface SpinnerLoaderProps {
  className?: string;
}

const SpinnerLoader = ({ className }: SpinnerLoaderProps) => {
  return (
    <div className={`${style.spinnerWrapper} ${className || ""}`}>
      <Image src="/spinners.svg" alt="로딩 아이콘" width={100} height={100} />
    </div>
  );
};

export default SpinnerLoader;
