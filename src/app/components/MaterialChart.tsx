import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { AnalysisResult } from "../types/material";

interface MaterialChartProps {
  results: AnalysisResult[];
}

export function MaterialChart({ results }: MaterialChartProps) {
  // Prepare data for bar chart
  const barChartData = results.map((r) => ({
    name: r.material.name.length > 15 ? r.material.name.slice(0, 15) + "..." : r.material.name,
    fullName: r.material.name,
    "Overall Score": r.score,
    Carbon: r.breakdown.carbonScore,
    Health: r.breakdown.healthScore,
    Regulatory: r.breakdown.regulatoryScore,
  }));

  // Prepare data for radar chart (top 5 materials)
  const radarChartData = [
    {
      metric: "Carbon",
      ...Object.fromEntries(
        results.slice(0, 5).map((r) => [r.material.name, r.breakdown.carbonScore])
      ),
    },
    {
      metric: "Health",
      ...Object.fromEntries(
        results.slice(0, 5).map((r) => [r.material.name, r.breakdown.healthScore])
      ),
    },
    {
      metric: "Regulatory",
      ...Object.fromEntries(
        results.slice(0, 5).map((r) => [r.material.name, r.breakdown.regulatoryScore])
      ),
    },
  ];

  const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Visual Comparison</h3>
      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="bar">Score Breakdown</TabsTrigger>
          <TabsTrigger value="radar">Multi-Metric View</TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="mt-0">
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  labelFormatter={(label) => {
                    const item = barChartData.find((d) => d.name === label);
                    return item?.fullName || label;
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="Overall Score" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Carbon" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Health" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Regulatory" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="radar" className="mt-0">
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarChartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                {results.slice(0, 5).map((r, idx) => (
                  <Radar
                    key={r.material.id}
                    name={r.material.name}
                    dataKey={r.material.name}
                    stroke={colors[idx]}
                    fill={colors[idx]}
                    fillOpacity={0.2}
                  />
                ))}
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 text-center mt-4">
            Showing top 5 materials for clarity
          </p>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
