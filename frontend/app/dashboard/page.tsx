"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Activity, Clock, Database, MessageSquare } from "lucide-react"

// Mock Data
const queryData = [
  { name: "Mon", queries: 45 },
  { name: "Tue", queries: 52 },
  { name: "Wed", queries: 38 },
  { name: "Thu", queries: 65 },
  { name: "Fri", queries: 48 },
  { name: "Sat", queries: 12 },
  { name: "Sun", queries: 8 },
]

const latencyData = [
  { name: "10am", latency: 1.2 },
  { name: "11am", latency: 1.5 },
  { name: "12pm", latency: 2.1 },
  { name: "1pm", latency: 1.8 },
  { name: "2pm", latency: 1.3 },
  { name: "3pm", latency: 1.1 },
]

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-gray-200 px-6 font-semibold">
        System Analytics
      </div>
      
      <div className="flex-1 overflow-auto p-6 space-y-6 bg-gray-50/30">
        
        {/* Top KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
              <MessageSquare className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">268</div>
              <p className="text-xs text-gray-500">+12% from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.4s</div>
              <p className="text-xs text-gray-500">-0.2s from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
              <Database className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34%</div>
              <p className="text-xs text-gray-500">+4% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-gray-500">All services operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Queries Over Time</CardTitle>
              <CardDescription>Daily volume for the past week</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={queryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="queries" fill="#111827" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Average Response Latency</CardTitle>
              <CardDescription>Response times for today (seconds)</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
