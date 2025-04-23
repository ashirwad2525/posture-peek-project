
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface AnalysisMetric {
  name: string;
  score: number;
  description: string;
  color: string;
}

const MetricCard = ({ metric }: { metric: AnalysisMetric }) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{metric.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Score</span>
            <span className="text-sm font-medium">{metric.score}%</span>
          </div>
          <Progress
            value={metric.score}
            className="h-2"
            style={{ backgroundColor: `${metric.color}20` }}
            indicatorClassName={`bg-gradient-to-r ${metric.color}`}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">{metric.description}</p>
      </CardContent>
    </Card>
  );
};

interface AnalysisMetricsProps {
  metrics: AnalysisMetric[];
}

const AnalysisMetrics = ({ metrics }: AnalysisMetricsProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>
    </div>
  );
};

export default AnalysisMetrics;
