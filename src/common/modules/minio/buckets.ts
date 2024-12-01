const {
  MINIO_APP_BUCKET,
  // MINIO_PRODUCT_BUCKET,
  // MINIO_INSTALLMENT_BUCKET,
  // MINIO_USER_DOCUMENT_BUCKET,
} = process.env;

export const AvailableMinIOBuckets = {
  APP_BUCKET: MINIO_APP_BUCKET || 'kalalotus',
  // PRODUCT_BUCKET: MINIO_PRODUCT_BUCKET,
  // INSTALLMENT_BUCKET: MINIO_INSTALLMENT_BUCKET,
  // MINIO_USER_DOCUMENT_BUCKET: MINIO_USER_DOCUMENT_BUCKET,
} as const;
export type AvailableMinIOBuckets =
  (keyof typeof AvailableMinIOBuckets)[number];
