import Link from "next/link";
import { DarkModeToggle } from "./dark-mode-toggle";

const Header = () => {
  return (
    <div>
      <ul>
        <li>
          <Link href={"/login"}>Đăng nhập</Link>
        </li>
        <li>
          <Link href={"/register"}>Đăng ký</Link>
        </li>
      </ul>
      <DarkModeToggle />
    </div>
  );
};
export default Header;
