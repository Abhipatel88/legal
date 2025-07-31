import { Layout } from "@/components/Layout"
import { DashboardStats } from "@/components/DashboardStats"
import { EmployeeChart } from "@/components/EmployeeChart"
import { QuickActions } from "@/components/QuickActions"
import { RecentActivity } from "@/components/RecentActivity"

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Welcome to MyLegalDesk HR Management System
          </p>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <EmployeeChart />
          </div>

          {/* Right Column - Quick Actions & Recent Activity */}
          <div className="space-y-6">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Index
