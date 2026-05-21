const isLoggingEnabled = (() => {
  const raw = process.env.LOGGING;
  if (raw === undefined) return true;
  const v = String(raw).toLowerCase().trim();
  return !(v === "false" || v === "0" || v === "no");
})();

function log(component: string, message: string, meta?: Record<string, unknown>): void {
  if (!isLoggingEnabled) return;
  const timestamp = new Date().toISOString();
  const payload: any = { timestamp, component, message };
  if (meta) payload.meta = meta;
  // Keep using console.log by design — minimal logger for development.
  console.log(JSON.stringify(payload));
}

export default { log, isLoggingEnabled };
