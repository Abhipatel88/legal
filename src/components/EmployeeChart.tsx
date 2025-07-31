
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const departmentData = [
  { name: 'Engineering', employees: 45, budget: 2800000 },
  { name: 'Sales', employees: 32, budget: 1600000 },
  { name: 'Marketing', employees: 28, budget: 1200000 },
  { name: 'HR', employees: 12, budget: 800000 },
  { name: 'Finance', employees: 18, budget: 1000000 },
  { name: 'Operations', employees: 22, budget: 900000 },
]

const ageDistribution = [
  { name: '20-25', value: 35, color: '#8884d8' },
  { name: '26-30', value: 68, color: '#82ca9d' },
  { name: '31-35', value: 52, color: '#ffc658' },
  { name: '36-40', value: 41, color: '#ff7c7c' },
  { name: '41-50', value: 38, color: '#8dd1e1' },
  { name: '50+', value: 13, color: '#d084d0' },
]

export function EmployeeChart() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Department Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={10}
                className="md:text-xs"
                interval={0}
              />
              <YAxis fontSize={10} className="md:text-xs" />
              <Tooltip
                formatter={(value, name) => [
                  name === 'employees' ? `${value} employees` : `$${(value as number).toLocaleString()}`,
                  name === 'employees' ? 'Employees' : 'Budget'
                ]}
                contentStyle={{
                  fontSize: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <Bar dataKey="employees" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Age Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <PieChart>
              <Pie
                data={ageDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={60}
                className="md:outerRadius-80"
                fill="#8884d8"
                dataKey="value"
                fontSize={10}
              >
                {ageDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} employees`, 'Count']}
                contentStyle={{
                  fontSize: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
