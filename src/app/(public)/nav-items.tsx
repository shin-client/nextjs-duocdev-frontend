"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppContext } from "@/components/app-provider";
import { Role } from "@/constants/type";
import { cn, handleErrorApi } from "@/lib/utils";
import { useLogout } from "@/queries/useAuth";
import { useGuestLogout } from "@/queries/useGuest";
import { RoleType } from "@/types/jwt.types";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menuItems: {
  title: string;
  href: string;
  roles?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Menu",
    href: "/guest/menu",
    roles: [Role.Guest],
  },
  {
    title: "Thanh toán",
    href: "/guest/orders",
    roles: [Role.Guest],
  },
  {
    title: "Đăng nhập",
    href: "/login",
    hideWhenLogin: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    roles: [Role.Owner, Role.Employee],
  },
];

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole, disconnectSocket } = useAppContext();
  const router = useRouter();

  const { mutateAsync: triggerLogout } = useLogout();
  const { mutateAsync: triggerGuestLogout } = useGuestLogout();

  const logout = async () => {
    try {
      const isGuest = role === Role.Guest;
      const logoutTrigger = isGuest ? triggerGuestLogout : triggerLogout;
      const redirectPath = isGuest ? "/" : "/login";

      await logoutTrigger();
      setRole();
      disconnectSocket();
      router.push(redirectPath);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <>
      {menuItems
        .filter((item) => {
          // Ẩn khi đã login
          if (item.hideWhenLogin && role) return false;

          // Lọc item có roles = role
          if (item.roles && item.roles.length > 0) {
            return role && item.roles.includes(role);
          }

          return true;
        })
        .map((item) => (
          <Link href={item.href} key={item.href} className={className}>
            {item.title}
          </Link>
        ))}

      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <span className={cn(className, "cursor-pointer")}>Đăng xuất</span>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Bạn có chắc chắn muốn đăng xuất?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Nếu bạn đang gọi món thì có thể mất làm mất thông tin các món
                bạn đang gọi và hoá đơn thanh toán!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Huỷ</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Đăng xuất</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
