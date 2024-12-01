declare namespace NodeJS {
  interface ProcessEnv {
    //Application
    SERVER_HOST: string;
    SERVER_PORT: number;
    NODE_ENV: string;
    //DATABASES
    MONGODB_URL: string;
    //MINIO
    MINIO_HOST: string;
    MINIO_PORT: string;
    MINIO_USE_SSL: string;
    MINIO_ACCESS_KEY: string;
    MINIO_SECRET_KEY: string;
    MINIO_APP_BUCKET: string;
    MINIO_PRODUCT_BUCKET: string;
    MINIO_INSTALLMENT_BUCKET: string;
    MINIO_USER_DOCUMENT_BUCKET: string;
    //JWT
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    //COOKIE
    COOKIE_SECRET: string;
    //SMS
    MELIPAYAMAK_SEND_OTP_SMS_URL: string;
    MELIPAYAMAK_SEND_SMS_URL: string;
    MELIPAYAMAK_SEND_SMS_NUMBER: string;
    MELIPAYAMAK_USERNAME: string;
    MELIPAYAMAK_PASSWORD: string;
    MELIPAYAMAK_BODY_ID: number;
    //Zarinpal
    ZARINPAL_MERCHANTID: string;
    ZARINPAL_REQUEST_UR: string;
    ZARINPAL_GATEWAY_UR: string;
    ZARINPAL_VERIFY_URL: string;
    //SWAGGER
    SWAGGER_USER: string;
    SWAGGER_PASSWORD: string;
  }
}
