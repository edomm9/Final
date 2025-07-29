// Configuration file for the Fayda Visitor Access System
const CONFIG = {
  // API Configuration - automatically detects environment
  // IMPORTANT: Replace 'https://your-backend.onrender.com' with your actual Render backend URL after deployment.
  API_BASE_URL:
    window.location.hostname === "localhost" ? "http://localhost:8000/api" : "https://your-backend.onrender.com/api",

  // VeriFayda OIDC Configuration
  // IMPORTANT: Replace 'https://your-vercel-app.vercel.app' with your actual Vercel frontend URL after deployment.
  OIDC: {
    CLIENT_ID: "crXYIYg2cJiNTaw5t-peoPzCRo-3JATNfBd5A86U8t0",
    REDIRECT_URI:
      window.location.hostname === "localhost"
        ? "http://localhost:8080/checkin.html"
        : "https://your-vercel-app.vercel.app/checkin.html",
    AUTHORIZATION_ENDPOINT: "https://esignet.ida.fayda.et/authorize",
    TOKEN_ENDPOINT: "https://esignet.ida.fayda.et/v1/esignet/oauth/v2/token",
    USERINFO_ENDPOINT: "https://esignet.ida.fayda.et/v1/esignet/oidc/userinfo",
    CLIENT_ASSERTION_TYPE: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
  },

  // Debug mode - set to false in production
  DEBUG: window.location.hostname === "localhost",

  // Test credentials for VeriFayda staging
  TEST_CREDENTIALS: {
    FAN: "3126894653473958",
    FIN: "6140798523917519",
    FIN3: "6230247319356120",
    OTP: "111111",
  },
}

// Utility function to get API URL with endpoint
CONFIG.getApiUrl = function (endpoint) {
  const baseUrl = this.API_BASE_URL.replace(/\/$/, "") // Remove trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, "") // Remove leading slash
  return `${baseUrl}/${cleanEndpoint}`
}

// Debug logging function
CONFIG.log = function (message, data = null) {
  if (this.DEBUG) {
    console.log(`[Fayda Visitor System] ${message}`, data || "")
  }
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG
}
