
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Calendar, FileText, Settings, Download, Mail } from "lucide-react"

const actions = [
  {
    title: "Add Employee",
    description: "Register new team member",
    icon: UserPlus,
    color: "bg-blue-500 hover:bg-blue-600"
  },
  {
    title: "Schedule Meeting",
    description: "Book interview or review",
    icon: Calendar,
    color: "bg-green-500 hover:bg-green-600"
  },
  {
    title: "Generate Report",
    description: "Create HR analytics report",
    icon: FileText,
    color: "bg-purple-500 hover:bg-purple-600"
  },
  {
    title: "System Settings",
    description: "Configure HR policies",
    icon: Settings,
    color: "bg-gray-500 hover:bg-gray-600"
  },
  {
    title: "Export Data",
    description: "Download employee data",
    icon: Download,
    color: "bg-orange-500 hover:bg-orange-600"
  },
  {
    title: "Send Notifications",
    description: "Broadcast to team",
    icon: Mail,
    color: "bg-indigo-500 hover:bg-indigo-600"
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 md:gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-3 md:p-4 flex flex-col items-center space-y-2 hover:scale-105 transition-all duration-200 hover:shadow-md"
            >
              <div className={`p-2 md:p-3 rounded-full ${action.color} text-white`}>
                <action.icon className="h-4 w-4 md:h-6 md:w-6" />
              </div>
              <div className="text-center">
                <div className="font-medium text-xs md:text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground hidden md:block">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
