import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  color?: "blue" | "green" | "orange" | "purple" | "red" | "indigo";
  badge?: string;
  actionLink?: string;
}

const colorClasses = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600",
  orange: "from-orange-500 to-orange-600",
  purple: "from-purple-500 to-purple-600",
  red: "from-red-500 to-red-600",
  indigo: "from-indigo-500 to-indigo-600",
};

export function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color = "blue",
  badge,
  actionLink,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold">{value}</h3>
              {change && (
                <span
                  className={`text-sm font-semibold flex items-center gap-1 ${
                    trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {change}
                </span>
              )}
            </div>
            {badge && (
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">
                  {badge}
                </span>
              </div>
            )}
          </div>
          <div
            className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}
          >
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
