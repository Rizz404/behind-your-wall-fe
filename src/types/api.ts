export interface Site {
  id: string
  name: string
  domain: string
  apiKey: string
  isActive: boolean
  createdAt: string
}

export interface Visitor {
  id: string
  fingerprintId: string
  visitCount: number
  country: string | null
  city: string | null
  isp: string | null
  timezone: string | null
  timezoneCountry: string | null
  firstSeenAt: string
  lastSeenAt: string
}

export interface UaBrand {
  brand: string
  version: string
}

export interface VisitLog {
  id: string
  visitorId: string
  siteId: string | null
  ip: string
  pageUrl: string | null
  referrer: string | null
  userAgent: string | null
  browser: string | null
  os: string | null
  deviceType: string | null
  screenRes: string | null
  language: string | null
  timezone: string | null
  uaBrands: UaBrand[] | null
  uaMobile: boolean | null
  uaPlatform: string | null
  uaPlatformVersion: string | null
  geoLat: number | null
  geoLon: number | null
  geoAccuracy: number | null
  createdAt: string
}

export interface FingerprintComponent {
  id: string
  visitorId: string
  canvasHash: string | null
  webglHash: string | null
  audioHash: string | null
  raw: Record<string, unknown> | null
  uaChRaw: Record<string, unknown> | null
}

export interface VisitorDetail extends Visitor {
  fingerprintComponent: FingerprintComponent | null
  visitLogs: VisitLog[]
}

export interface PaginatedVisitors {
  items: Visitor[]
  total: number
  skip: number
  take: number
}

export interface ListVisitorsQuery {
  skip?: number
  take?: number
  country?: string
  from?: string
  to?: string
}

export interface VisitorSummary {
  visitorId: string
  fingerprintId: string
  visitCount: number
  firstSeenAt: string
  lastSeenAt: string
  country: string | null
  city: string | null
  isp: string | null
  timezone: string | null
  timezoneCountry: string | null
  siteId: string | null
  siteName: string | null
  siteDomain: string | null
  lastPageUrl: string | null
  lastReferrer: string | null
  lastBrowser: string | null
  lastOs: string | null
  lastDeviceType: string | null
  lastScreenRes: string | null
  lastLanguage: string | null
  lastIp: string | null
  lastUaMobile: boolean | null
  lastUaPlatform: string | null
  lastGeoLat: number | null
  lastGeoLon: number | null
}

export interface PaginatedVisitorSummary {
  items: VisitorSummary[]
  total: number
  skip: number
  take: number
}

export interface ListVisitorsSummaryQuery {
  skip?: number
  take?: number
  country?: string
  from?: string
  to?: string
}

export interface BlockedIp {
  id: string
  ip: string
  reason: string | null
  blockedBy: string | null
  expiresAt: string | null
  createdAt: string
}

export interface CreateBlockedIpDto {
  ip: string
  reason?: string
  expiresAt?: string
}

export interface BlocklistCheckResult {
  blocked: boolean
  reason?: string | null
  expiresAt?: string | null
}

export interface CreateSiteDto {
  name: string
  domain: string
}

export interface AnalyticsOverview {
  totalVisitors: number
  totalVisits: number
  topCountries: { country: string; count: number }[]
  last30Days: { day: string; count: number }[]
}

export interface LoginDto {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
}

export interface ApiErrorResponse {
  statusCode: number
  message: string | string[]
  error?: string
}
