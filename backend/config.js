const app = {
  port: process.env.PORT || 3001,
  production: process.env.NODE_ENV === 'production',
  notmEndpointUrl: process.env.NN_ENDPOINT_URL || 'http://localhost:3000/',
  prisonStaffHubUrl: process.env.PRISON_STAFF_HUB_UI_URL || 'http://localhost:3002/',
  mailTo: process.env.MAIL_TO || 'feedback@digital.justice.gov.uk',
  tokenRefreshThresholdSeconds: process.env.TOKEN_REFRESH_THRESHOLD_SECONDS || 60,
  offenderSearchResultMax: process.env.OFFENDER_SEARCH_RESULT_MAX || 200,
  applicationCaseload: process.env.APPLICATION_CASELOAD || 'NWEB',
  keyworkerProfileStatsEnabled: process.env.KEYWORKER_PROFILE_STATS_ENABLED || 'false',
  keyworkerDashboardStatsEnabled: process.env.KEYWORKER_DASHBOARD_STATS_ENABLED === 'true',
  url: process.env.OMIC_UI_URL || `http://localhost:${process.env.PORT || 3001}`,
}

const setTestDefaults = () => {
  // Setup different default values when running locally or integration tests
  // .env file still overrides.
  if (!process.env.OFFENDER_SEARCH_RESULT_MAX) {
    app.offenderSearchResultMax = 50
  }

  app.keyworkerProfileStatsEnabled = 'true'
}

const analytics = {
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
}

const hmppsCookie = {
  name: process.env.HMPPS_COOKIE_NAME || 'hmpps-session-dev',
  domain: process.env.HMPPS_COOKIE_DOMAIN || 'localhost',
  expiryMinutes: process.env.WEB_SESSION_TIMEOUT_IN_MINUTES || 20,
  sessionSecret: process.env.SESSION_COOKIE_SECRET || 'notm-insecure-session',
}

const apis = {
  oauth2: {
    url: process.env.OAUTH_ENDPOINT_URL || 'http://localhost:9090/auth/',
    ui_url: process.env.OAUTH_ENDPOINT_UI_URL || process.env.OAUTH_ENDPOINT_URL || 'http://localhost:9090/auth/',
    timeoutSeconds: process.env.OAUTH_ENDPOINT_TIMEOUT_SECONDS || 10,
    clientId: process.env.API_CLIENT_ID || 'elite2apiclient',
    clientSecret: process.env.API_CLIENT_SECRET || 'clientsecret',
  },
  elite2: {
    url: process.env.API_ENDPOINT_URL || 'http://localhost:8080/',
    timeoutSeconds: process.env.API_ENDPOINT_TIMEOUT_SECONDS || 30,
  },
  keyworker: {
    url: process.env.KEYWORKER_API_URL || 'http://localhost:8081/',
    timeoutSeconds: process.env.KEYWORKER_API_TIMEOUT_SECONDS || 30,
    ui_url: process.env.OMIC_UI_URL,
  },
}

module.exports = {
  app,
  analytics,
  hmppsCookie,
  apis,
  setTestDefaults,
}
