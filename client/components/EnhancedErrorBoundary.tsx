import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check for chunk load error (version mismatch)
    if (error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Importing a module script failed')) {
      // Reload the page to fetch new chunks
      window.location.reload();
      return { hasError: false, error: undefined };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);

    this.props.onError?.(error, errorInfo);

    if (import.meta.env.PROD) {
      try {
        fetch('/api/log-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: error.toString(),
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (e) {
        console.error('Failed to log error:', e);
      }
    }

    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">حدث خطأ ما</h1>

            <p className="text-muted-foreground text-center mb-6">
              نعتذر عن الإزعاج. حدث خطأ غير متوقع أثناء تحميل هذه الصفحة.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6">
                <details className="bg-gray-100 p-4 rounded text-xs">
                  <summary className="cursor-pointer font-semibold mb-2">
                    تفاصيل الخطأ (للمطورين فقط)
                  </summary>
                  <pre className="overflow-auto whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {'\n\n'}
                    {this.state.error.stack}
                  </pre>
                </details>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => window.location.reload()}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                إعادة المحاولة
              </Button>

              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                الصفحة الرئيسية
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
