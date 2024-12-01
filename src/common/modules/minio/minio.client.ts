import { Client } from 'minio';

const minioConnection = {
  endPoint: process.env.MINIO_HOST, // Ensure this is set correctly
  port: parseInt(process.env.MINIO_PORT || '9000', 10), // Default to 9000 if not set
  useSSL: process.env.MINIO_USE_SSL === 'true', // Correctly check for 'true'
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
};

export default new Client(minioConnection);
