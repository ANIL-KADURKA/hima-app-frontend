type AuthDebugDetails = Record<string, boolean | number | string | null | undefined>;

function getSafeErrorMessage(error: unknown): string | undefined {
  if (!(error instanceof Error) || error.message.length === 0) return undefined;

  return error.message
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[email]')
    .replace(/\+?\d[\d\s().-]{6,}\d/g, '[number]')
    .replace(/\b\d{4,8}\b/g, '[code]')
    .replace(/\bBearer\s+\S+/gi, 'Bearer [redacted]')
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[token]')
    .slice(0, 240);
}

function getSafeErrorStack(error: unknown): string | undefined {
  if (!(error instanceof Error) || error.stack === undefined) return undefined;

  return error.stack
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[email]')
    .replace(/\+?\d[\d\s().-]{6,}\d/g, '[number]')
    .replace(/\b\d{4,8}\b/g, '[code]')
    .replace(/\bBearer\s+\S+/gi, 'Bearer [redacted]')
    .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[token]')
    .slice(0, 1200);
}

export function logAuthDebug(event: string, details: AuthDebugDetails = {}): void {
  if (__DEV__) console.info(`[auth] ${event}`, details);
}

export function logAuthWarning(event: string, error: unknown): void {
  if (!__DEV__) return;

  const details: AuthDebugDetails = {
    errorType: error instanceof Error ? error.name : typeof error,
    errorMessage: getSafeErrorMessage(error),
    errorStack: getSafeErrorStack(error),
  };
  if (typeof error === 'object' && error !== null) {
    const candidate = error as { code?: unknown; status?: unknown; nativeCode?: unknown };
    if (typeof candidate.code === 'string' && /^[a-z][a-z0-9_/.-]*$/i.test(candidate.code)) {
      details.errorCode = candidate.code;
    }
    if (typeof candidate.status === 'number') details.status = candidate.status;
    if (typeof candidate.nativeCode === 'string') details.nativeCode = candidate.nativeCode;
  }

  console.warn(`[auth] ${event}`, details);
}
