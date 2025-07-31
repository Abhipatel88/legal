import { 
  Users, 
  UserCog,
  Calendar, 
  BarChart3, 
  FileText, 
  Settings, 
  Home,
  UserPlus,
  Clock,
  DollarSign,
  Award,
  Building2,
  ChevronRight,
  Shield,
  Cog
} from "lucide-react"
import { NavLink, useLocation, Link } from "react-router-dom"
import { cn } from "@/lib/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home, color: "text-blue-500" },
  { title: "Users", url: "/users", icon: UserCog, color: "text-indigo-500" },
  { title: "Employees", url: "/employees", icon: Users, color: "text-green-500" },
  { title: "Recruitment", url: "/recruitment", icon: UserPlus, color: "text-purple-500" },
  { title: "Attendance", url: "/attendance", icon: Clock, color: "text-orange-500" },
  { title: "Payroll", url: "/payroll", icon: DollarSign, color: "text-emerald-500" },
  { title: "Performance", url: "/performance", icon: Award, color: "text-yellow-500" },
]

const masterItems = [
  { title: "Departments", url: "/masters/departments", icon: Building2, color: "text-blue-500" },
  { title: "Shifts", url: "/masters/shifts", icon: Clock, color: "text-green-500" },
  { title: "Holidays", url: "/masters/holidays", icon: Calendar, color: "text-red-500" },
  { title: "Leave Types", url: "/masters/leave-types", icon: FileText, color: "text-purple-500" },
  { title: "Roles", url: "/masters/roles", icon: Users, color: "text-orange-500" },
  { title: "Permissions", url: "/masters/permissions", icon: Shield, color: "text-cyan-500" },
  { title: "Work Weeks", url: "/masters/work-weeks", icon: Calendar, color: "text-indigo-500" },
]

const managementItems = [
  { title: "Analytics", url: "/analytics", icon: BarChart3, color: "text-indigo-500" },
  { title: "Calendar", url: "/calendar", icon: Calendar, color: "text-red-500" },
  { title: "Reports", url: "/reports", icon: FileText, color: "text-cyan-500" },
  { title: "Settings", url: "/settings", icon: Settings, color: "text-gray-500" },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  
  const getNavCls = (path: string) => {
    const active = isActive(path)
    return cn(
      "group flex items-center rounded-lg text-sm font-medium transition-all duration-200 ease-in-out",
      isCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
      active
        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
    )
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className={cn(
        "border-b border-gray-200 dark:border-gray-800",
        isCollapsed ? "p-4" : "p-6"
      )}>
        <div className={cn(
          "flex items-center",
          isCollapsed ? "justify-center" : "gap-3"
        )}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-xl text-gray-900 dark:text-gray-100">MyLegalDesk</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">HR Management</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className={cn("py-6", isCollapsed ? "px-2" : "px-4")}>
        {/* Main Menu */}
        <SidebarGroup className="mb-8">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Main Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavCls(item.url)}>
                        {isCollapsed ? (
                          <item.icon className={cn(
                            "w-5 h-5 transition-colors",
                            active ? "text-white" : item.color
                          )} />
                        ) : (
                          <>
                            <div className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                              active ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"
                            )}>
                              <item.icon className={cn(
                                "w-4 h-4 transition-colors",
                                active ? "text-white" : item.color
                              )} />
                            </div>
                            <span className="flex-1">{item.title}</span>
                            {active && (
                              <ChevronRight className="w-4 h-4 text-white/80" />
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Masters */}
        <SidebarGroup className="mb-8">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Masters
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {masterItems.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavCls(item.url)}>
                        {isCollapsed ? (
                          <item.icon className={cn(
                            "w-5 h-5 transition-colors",
                            active ? "text-white" : item.color
                          )} />
                        ) : (
                          <>
                            <div className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                              active ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"
                            )}>
                              <item.icon className={cn(
                                "w-4 h-4 transition-colors",
                                active ? "text-white" : item.color
                              )} />
                            </div>
                            <span className="flex-1">{item.title}</span>
                            {active && (
                              <ChevronRight className="w-4 h-4 text-white/80" />
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Management
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {managementItems.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} end className={getNavCls(item.url)}>
                        {isCollapsed ? (
                          <item.icon className={cn(
                            "w-5 h-5 transition-colors",
                            active ? "text-white" : item.color
                          )} />
                        ) : (
                          <>
                            <div className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-lg transition-colors",
                              active ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"
                            )}>
                              <item.icon className={cn(
                                "w-4 h-4 transition-colors",
                                active ? "text-white" : item.color
                              )} />
                            </div>
                            <span className="flex-1">{item.title}</span>
                            {active && (
                              <ChevronRight className="w-4 h-4 text-white/80" />
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
      </SidebarGroup>

      {/* Settings Section */}
      <SidebarGroup>
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/settings/company">
                  <Building2 className="w-4 h-4" />
                  <span>Company Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/settings/smtp">
                  <Cog className="w-4 h-4" />
                  <span>SMTP Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  )
}