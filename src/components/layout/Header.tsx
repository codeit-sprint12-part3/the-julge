import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header>
      <Link href={"/"}>
        <Image src="/logo.svg" alt="더줄게 로고" width={108} height={20} />
      </Link>
    </header>
  );
};

export default Header;
