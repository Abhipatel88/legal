
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    user: "Sarah Johnson",
    action: "Completed onboarding",
    department: "Engineering",
    time: "2 hours ago",
    avatar: "/placeholder.svg",
    type: "success"
  },
  {
    id: 2,
    user: "Mike Chen",
    action: "Submitted leave request",
    department: "Marketing",
    time: "4 hours ago",
    avatar: "/placeholder.svg",
    type: "pending"
  },
  {
    id: 3,
    user: "Emily Davis",
    action: "Performance review due",
    department: "Sales",
    time: "1 day ago",
    avatar: "/placeholder.svg",
    type: "warning"
  },
  {
    id: 4,
    user: "David Wilson",
    action: "Training completed",
    department: "HR",
    time: "2 days ago",
    avatar: "/placeholder.svg",
    type: "success"
  },
  {
    id: 5,
    user: "Lisa Brown",
    action: "Started new position",
    department: "Finance",
    time: "3 days ago",
    avatar: "/placeholder.svg",
    type: "info"
  }
]

const getBadgeVariant = (type: string) => {
  switch (type) {
    case 'success': return 'default'
    case 'warning': return 'destructive'
    case 'pending': return 'secondary'
    case 'info': return 'outline'
    default: return 'default'
  }
}

export function RecentActivity() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
                <AvatarImage src={activity.avatar} alt={activity.user} />
                <AvatarFallback className="text-xs md:text-sm">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs md:text-sm font-medium truncate">{activity.user}</p>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground">{activity.action}</p>
                <Badge variant={getBadgeVariant(activity.type)} className="text-xs">
                  {activity.department}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
