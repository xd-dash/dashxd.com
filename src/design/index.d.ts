export type WorkerMeta = {
  service: string
  colo: string | null
  country: string | null
  httpProtocol: string | null
  tlsVersion: string | null
  ray: string | null
}

export const DASHXD_LOGO_URL: string
export const DASHXD_CSS: string

export function escapeHtml(value: unknown): string
export function workerMetaFromRequest(request: Request & { cf?: Record<string, unknown> }, service: string): WorkerMeta
export function formatWorkerMeta(meta: WorkerMeta): string
export function renderBrand(options?: { logoUrl?: string; alt?: string }): string
export function renderFooter(options: { meta?: WorkerMeta | null; year?: number; owner?: string }): string
export function renderDocument(options: {
  title: string
  body: string
  meta?: WorkerMeta | null
  logoUrl?: string
  logoAlt?: string
  head?: string
  script?: string
}): string
