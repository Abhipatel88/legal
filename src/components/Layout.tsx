
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut, userRole, isAdmin, isHRManager } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = () => {
    if (isAdmin) return 'text-red-600';
    if (isHRManager) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full bg-gray-50 overflow-hidden">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col h-full">
          <header className="h-14 md:h-16 bg-white border-b border-gray-200 flex items-center px-3 md:px-6 shadow-sm flex-shrink-0">
            <SidebarTrigger className="mr-2 md:mr-4" />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-xl font-semibold text-gray-900 truncate">HR Dashboard</h1>
              <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Welcome back! Here's what's happening with your team.</p>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1 md:space-x-2 h-auto p-1 md:p-2">
                    {/* Hide text on mobile, show only on md+ */}
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium">{getUserDisplayName()}</p>
                      <p className={`text-xs ${getRoleColor()}`}>
                        {userRole || 'Employee'}
                      </p>
                    </div>
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium">
                      {getUserInitials()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="p-3 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
