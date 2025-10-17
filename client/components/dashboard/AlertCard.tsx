import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface AlertCardProps {
  variant: "info" | "warning" | "error" | "success";
  title?: string;
  message: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
}

const variantConfig = {
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    textColor: "text-blue-700 dark:text-blue-300",
    iconColor: "text-blue-500",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    textColor: "text-orange-700 dark:text-orange-300",
    iconColor: "text-orange-500",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-50 dark:bg-red-950/20",
    textColor: "text-red-700 dark:text-red-300",
    iconColor: "text-red-500",
    borderColor: "border-red-200 dark:border-red-800",
  },
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-950/20",
    textColor: "text-green-700 dark:text-green-300",
    iconColor: "text-green-500",
    borderColor: "border-green-200 dark:border-green-800",
  },
};

export function AlertCard({
  variant,
  title,
  message,
  actionLabel,
  actionLink,
  onAction,
}: AlertCardProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1 space-y-1">
            {title && (
              <h4 className={`font-semibold ${config.textColor}`}>{title}</h4>
            )}
            <p className={`text-sm ${config.textColor}`}>{message}</p>
            {(actionLabel || actionLink) && (
              <div className="pt-2">
                {actionLink ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link to={actionLink}>{actionLabel}</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={onAction}>
                    {actionLabel}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
