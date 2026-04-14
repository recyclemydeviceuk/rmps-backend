import { S3Client } from '@aws-sdk/client-s3';
import { env } from './env';

export const s3Client = new S3Client({
  region: env.AWS_S3_REGION,
  credentials: {
    accessKeyId:     env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

// S3 key prefixes per entity type
export const S3_FOLDERS = {
  DEVICES: 'devices',
  BRANDS:  'brands',
  MODELS:  'models',
  ADDONS:  'addons',
  MISC:    'misc',
} as const;
