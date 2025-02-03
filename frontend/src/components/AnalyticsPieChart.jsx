import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFF"];

const AnalyticsPieCharts = ({ groupByKey }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {Object.entries(groupByKey).map(([key, data], index) => (
        <Card key={key} className="shadow-lg bg-neutral-100 rounded-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="field"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {data.map((_, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsPieCharts;
