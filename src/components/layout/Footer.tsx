import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div>
        <p>©codeit - 2023</p>
        <ul>
          <li>
            <Link href={"/"}>Privacy Policy</Link>
          </li>
          <li>
            <Link href={"/"}>FAQ</Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link href={"/"}>이메일</Link>
          </li>
          <li>
            <Link href={"/"}>페이스북</Link>
          </li>
          <li>
            <Link href={"/"}>인스타</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
