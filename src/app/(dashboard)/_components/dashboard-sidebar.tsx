"use client";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  Mail,
  Users,
  CircleDollarSign,
  // CreditCard,
  MessageCircle,
  TicketPercent,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import logo from "../../../../public/assets/images/logo.jpg";

const items = [
  {
    title: "Dashboard Overview",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    url: "/user-management",
    icon: Users,
  },
  {
    title: "Guest Management",
    url: "/guest-management",
    icon: Users,
  },
  {
    title: "Contact Management",
    url: "/contact-management",
    icon: Mail,
  },
  {
    title: "Newsletter Management",
    url: "/newsletter-management",
    icon: MessageCircle,
  },
    {
    title: "Coupon Management",
    url: "/coupon-management",
    icon: TicketPercent ,
  },



  // {
  //   title: "Pricing & Payment",
  //   url: "/pricing-and-payment",
  //   icon: CreditCard ,
  // },
  {
    title: "Revenue",
    url: "/revenue",
    icon: CircleDollarSign,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathName = usePathname();

  return (
    <Sidebar className="border-none w-[330px]">
      <SidebarContent className="bg-white scrollbar-hide">
        <SidebarGroup className="p-0">
          <div className="flex flex-col justify-between min-h-screen pb-5">
            <div>
              <SidebarGroupLabel className="mt-5 mb-5 h-[80px] flex justify-center">
                <Link href={`/`}>
                  <Image
                    src={logo}
                    alt="logo"
                    width={1000}
                    height={1000}
                    className="h-[100px] w-[240px] object-cover"
                  />
                </Link>
              </SidebarGroupLabel>
              <SidebarGroupContent className="px-4 pt-5">
                <SidebarMenu>
                  {items.map((item) => {
                    const isActive =
                      item.url === "/"
                        ? pathName === "/"
                        : pathName === item.url ||
                          pathName.startsWith(`${item.url}/`);

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          className={`h-[60px] rounded-none text-[20px] text-primary hover:bg-[#f8f9fa] hover:text-primary transition-all duration-300 ${
                            isActive &&
                            "bg-[#f8f9fa] hover:bg-[#f8f9fa] text-primary shadow-[0px_4px_6px_0px_#DF10201A] hover:text-primary hover:shadow-[0px_4px_6px_0px_#DF10201A] font-medium"
                          }`}
                          asChild
                        >
                          <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>

            <div>
              <SidebarFooter className="border-t border-gray-300">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="font-medium text-red-500 flex items-center gap-2 pl-2 mt-5"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </SidebarFooter>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
