"use client";
import menuItems from "@/app/manage/menuItems";
import { useAppStore } from "@/components/app-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Role } from "@/constants/type";
import { cn } from "@/lib/utils";
import { Package2, PanelLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNavLinks() {
  const pathname = usePathname();
  const { role } = useAppStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetTitle className="sr-only"></SheetTitle>
        <SheetDescription className="sr-only"></SheetDescription>

        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="group bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          {menuItems
            .filter(
              (item) => role && role !== Role.Guest && item.role.includes(role),
            )
            .map((Item, index) => {
              const isActive = pathname === Item.href;
              return (
                <Link
                  key={index}
                  href={Item.href}
                  className={cn(
                    "hover:text-foreground flex items-center gap-4 px-2.5",
                    {
                      "text-foreground": isActive,
                      "text-muted-foreground": !isActive,
                    },
                  )}
                >
                  <Item.Icon className="h-5 w-5" />
                  {Item.title}
                </Link>
              );
            })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
