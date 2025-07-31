
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Clock, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Total Employees",
    value: "247",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600"
  },
  {
    title: "New Hires",
    value: "18",
    change: "+5%",
    trend: "up", 
    icon: UserPlus,
    color: "text-green-600"
  },
  {
    title: "Attendance Rate",
    value: "94.2%",
    change: "-1.2%",
    trend: "down",
    icon: Clock,
    color: "text-orange-600"
  },
  {
    title: "Avg Salary",
    value: "$68,420",
    change: "+3.1%",
    trend: "up",
    icon: DollarSign,
    color: "text-purple-600"
  },
  {
    title: "Open Positions",
    value: "12",
    change: "+4",
    trend: "up",
    icon: AlertTriangle,
    color: "text-red-600"
  },
  {
    title: "Employee Satisfaction",
    value: "4.3/5",
    change: "+0.2",
    trend: "up",
    icon: TrendingUp,
    color: "text-indigo-600"
  }
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 mb-6 md:mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground truncate">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color} flex-shrink-0`} />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs md:text-sm mt-1">
              <span className={`font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-muted-foreground ml-1 hidden sm:inline">from last month</span>
              <span className="text-muted-foreground ml-1 sm:hidden">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
