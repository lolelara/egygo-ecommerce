import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console or error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-3 text-destructive">
                <AlertTriangle className="h-8 w-8" />
                <CardTitle className="text-2xl">حدث خطأ غير متوقع</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-gray-600">
                  نعتذر عن المشكلة. حدث خطأ أثناء تحميل هذه الصفحة.
                </p>
                
                {/* Error Details (only in development) */}
                {import.meta.env.DEV && this.state.error && (
                  <details className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <summary className="cursor-pointer font-semibold text-red-800 mb-2">
                      تفاصيل الخطأ (للمطورين فقط)
                    </summary>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong className="text-red-700">Error:</strong>
                        <pre className="mt-1 overflow-auto text-red-600 bg-white p-2 rounded">
                          {this.state.error.toString()}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong className="text-red-700">Stack Trace:</strong>
                          <pre className="mt-1 overflow-auto text-red-600 bg-white p-2 rounded text-xs">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={this.handleReset}
                  className="flex-1"
                  variant="outline"
                >
                  <RefreshCw className="ml-2 h-4 w-4" />
                  إعادة المحاولة
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  className="flex-1"
                >
                  <Home className="ml-2 h-4 w-4" />
                  العودة للرئيسية
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-sm text-gray-500 text-center pt-4 border-t">
                إذا استمرت المشكلة، يرجى{" "}
                <a
                  href="/contact"
                  className="text-primary hover:underline"
                >
                  التواصل مع الدعم الفني
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple Error Display Component (for inline errors)
 */
export function ErrorDisplay({
  error,
  onRetry,
  title = "حدث خطأ",
}: {
  error: Error | string;
  onRetry?: () => void;
  title?: string;
}) {
  const errorMessage = typeof error === "string" ? error : error.message;

  return (
    <Card className="border-destructive">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-destructive">{title}</h3>
            <p className="text-sm text-gray-600">{errorMessage}</p>
            {onRetry && (
              <Button
                onClick={onRetry}
                size="sm"
                variant="outline"
                className="mt-3"
              >
                <RefreshCw className="ml-2 h-3 w-3" />
                إعادة المحاولة
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
