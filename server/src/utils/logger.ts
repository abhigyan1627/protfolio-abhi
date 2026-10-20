type Level = 'info' | 'warn' | 'error';

// Log metadata must contain identifiers and status values only. Never log bodies, cookies, passwords or enquiry text.
export type LogMeta = Record<string, string | number | boolean | null | undefined>;

function write(level: Level, message: string, meta?: LogMeta): void {
  const line = JSON.stringify({ time: new Date().toISOString(), level, message, ...meta });
  if (level === 'error') {
    console.error(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info: (message: string, meta?: LogMeta) => write('info', message, meta),
  warn: (message: string, meta?: LogMeta) => write('warn', message, meta),
  error: (message: string, meta?: LogMeta) => write('error', message, meta),
};
