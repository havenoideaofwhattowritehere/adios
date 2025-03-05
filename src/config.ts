const config = {
  env: process.env.NODE_ENV || 'development',
  app: {
    port: process.env.APP_PORT || 3000,
  },
  auth: {
    jwt_secret: process.env.JWT_SECRET,
    jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `${process.env.AUTH0_ISSUER_URL}`,
    auth0MgmtClientId: process.env.AUTH0_MGMT_CLIENT_ID,
    auth0MgmtClientSecret: process.env.AUTH0_MGMT_CLIENT_SECRET,
    auth0ClientId: process.env.AUTH0_CLIENT_ID,
    auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET,
    auth0ApiClientId: process.env.AUTH0_API_CLIENT_ID,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  vapid_key: {
    subject: process.env.PUSH_SUBJECT,
  },
  bot: {
    token: process.env.BOT_TOKEN,
    link: process.env.BOT_LINK,
  },
  cron: {
    cronTime: process.env.CRON_TIME || '0 3 * * *',
  },
};

export default config;
