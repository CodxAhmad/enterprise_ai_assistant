"use client"

import { Activity, Clock, Database, MessageSquare } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

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

const kpis = [
  { label: "Total Queries", value: "268", sub: "+12% from last week", icon: MessageSquare },
  { label: "Avg Latency", value: "1.4s", sub: "-0.2s from last week", icon: Clock },
  { label: "Cache Hit Rate", value: "34%", sub: "+4% from last week", icon: Database },
  { label: "System Health", value: "Online", sub: "All services operational", icon: Activity, green: true },
]

export default function DashboardPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "var(--main-bg)",
        color: "var(--main-text)",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid var(--main-border)",
          fontSize: "15px",
          fontWeight: 500,
          color: "var(--main-text)",
          flexShrink: 0,
        }}
      >
        System Analytics
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "32px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* KPI Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {kpis.map((kpi) => {
              const Icon = kpi.icon
              return (
                <div
                  key={kpi.label}
                  style={{
                    padding: "20px",
                    borderRadius: "14px",
                    border: "1px solid var(--card-border)",
                    background: "var(--card-bg)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "var(--main-text-muted)", fontWeight: 500 }}>
                      {kpi.label}
                    </span>
                    <Icon size={16} color="var(--main-text-muted)" />
                  </div>
                  <div
                    style={{
                      fontSize: "26px",
                      fontWeight: 700,
                      color: kpi.green ? "#22c55e" : "var(--main-text)",
                      marginBottom: "4px",
                    }}
                  >
                    {kpi.value}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--main-text-muted)" }}>{kpi.sub}</div>
                </div>
              )
            })}
          </div>

          {/* Charts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div
              style={{
                padding: "20px",
                borderRadius: "14px",
                border: "1px solid var(--card-border)",
                background: "var(--card-bg)",
              }}
            >
              <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--main-text)", margin: "0 0 4px" }}>
                Queries Over Time
              </p>
              <p style={{ fontSize: "12px", color: "var(--main-text-muted)", margin: "0 0 20px" }}>
                Daily volume for the past week
              </p>
              <div style={{ height: "240px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={queryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--main-border)" />
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "var(--main-text-muted)" }} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "var(--main-text-muted)" }} />
                    <Tooltip contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--main-text)" }} />
                    <Bar dataKey="queries" fill="var(--main-text)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div
              style={{
                padding: "20px",
                borderRadius: "14px",
                border: "1px solid var(--card-border)",
                background: "var(--card-bg)",
              }}
            >
              <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--main-text)", margin: "0 0 4px" }}>
                Response Latency
              </p>
              <p style={{ fontSize: "12px", color: "var(--main-text-muted)", margin: "0 0 20px" }}>
                Response times today (seconds)
              </p>
              <div style={{ height: "240px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--main-border)" />
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "var(--main-text-muted)" }} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: "var(--main-text-muted)" }} />
                    <Tooltip contentStyle={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "8px", color: "var(--main-text)" }} />
                    <Line type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
