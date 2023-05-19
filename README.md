# jwt-refresh-token-nodejs-postgres
Apply refresh token feature with a simple node.js app

### envaironment variables:
create file `.env` in the root path, then copy the next envaironment variables to it.

- PORT = `Server port`
- DB_POOL_URL = `Database URL for the Pool connection`
- DB_CLIENT_URL = `Database URL for the Client connection`
- DB_NAME = `Database name`
- JWT_SECRET = `The secret of JWT`
- REFRESH_TOKEN_PERIOD = 86400000 `1 Day in milliseconds`
- JWT_EXPRIRES_IN = 900 # `15 minutes in seconds`
