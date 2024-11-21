import {
  Calendar,
  GalleryVerticalEnd,
  Lightbulb,
  Settings,
} from "lucide-react";
import {
  Home,
  //Link,
  Menu,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";
import { ActiveTab } from "@/App";

// This is sample data.
const data = {
  nav: [
    { name: "Dashboard", icon: Home, componentId: "dashboard" },
    { name: "Idea Bank", icon: Lightbulb, componentId: "ideas" },
    { name: "Videos", icon: Menu, componentId: "videos" },
    { name: "Schedule", icon: Calendar, componentId: "schedule" },
    { name: "Settings", icon: Settings, componentId: "settings" },
    //{ name: "Connected accounts", icon: Link, componentId: "accounts" },
  ],
};

interface Props extends ComponentProps<typeof Sidebar> {
  onNavigate: (value: ActiveTab) => void;
  currentTab: ActiveTab;
}

export function AppSidebar({ onNavigate, currentTab, ...props }: Props) {
  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-destructive text-neutral-50">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">YT Video Planner</span>
                  <span className="opacity-60">v0.4.4</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.nav.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentTab === item.componentId}
                    onClick={() => onNavigate(item.componentId as ActiveTab)}
                  >
                    <a href="#">
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
