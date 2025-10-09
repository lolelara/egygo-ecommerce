import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    return log;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: fileFormat,
  defaultMeta: { service: 'egygo-api' },
  transports: [
    // Error log file
    new DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
    
    // Combined log file
    new DailyRotateFile({
      filename: path.join(logsDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true,
    }),
    
    // Audit log file (for security events)
    new DailyRotateFile({
      filename: path.join(logsDir, 'audit-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'warn',
      maxSize: '20m',
      maxFiles: '30d',
      zippedArchive: true,
    }),
  ],
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

// Custom logging methods
export const loggers = {
  // General logging
  info: (message: string, meta?: any) => logger.info(message, meta),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  error: (message: string, error?: Error | any, meta?: any) => {
    if (error instanceof Error) {
      logger.error(message, { error: error.message, stack: error.stack, ...meta });
    } else {
      logger.error(message, { error, ...meta });
    }
  },
  debug: (message: string, meta?: any) => logger.debug(message, meta),

  // Security logging
  security: (event: string, details: any) => {
    logger.warn(`SECURITY: ${event}`, {
      type: 'security',
      timestamp: new Date().toISOString(),
      ...details,
    });
  },

  // API logging
  api: (method: string, url: string, statusCode: number, responseTime: number, userAgent?: string) => {
    logger.info('API Request', {
      type: 'api',
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
      userAgent,
    });
  },

  // Database logging
  database: (operation: string, collection: string, duration: number, success: boolean) => {
    logger.info('Database Operation', {
      type: 'database',
      operation,
      collection,
      duration: `${duration}ms`,
      success,
    });
  },

  // Business logic logging
  business: (event: string, details: any) => {
    logger.info(`BUSINESS: ${event}`, {
      type: 'business',
      timestamp: new Date().toISOString(),
      ...details,
    });
  },
};

// Error tracking middleware
export const errorTracker = (error: Error, context?: any) => {
  loggers.error('Unhandled Error', error, context);
  
  // In production, you might want to send this to an external service
  // like Sentry, LogRocket, or DataDog
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with external error tracking service
    console.error('Production error tracking not implemented yet');
  }
};

// Request logging middleware
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    loggers.api(
      req.method,
      req.originalUrl,
      res.statusCode,
      duration,
      req.get('User-Agent')
    );
  });
  
  next();
};

export default logger;
