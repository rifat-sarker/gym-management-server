import dotenv from "dotenv";

import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  node_env: process.env.node_env,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  jwt: {
    jwt_scret: process.env.JWT_SECRET,
    expires_in: process.env.EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOEKN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOEKN_EXPIRES_IN,
  },
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
};
