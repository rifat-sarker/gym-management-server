import dotenv from "dotenv";

import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  node_env: process.env.node_env,
  jwt: {
    jwt_scret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOEKN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOEKN_EXPIRES_IN,
  },
};
