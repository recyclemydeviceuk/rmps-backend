import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { s3Client } from '../config/s3';
import { env } from '../config/env';

export class UploadService {
  /**
   * Upload a file buffer to S3.
   * @param buffer   - File buffer from multer memory storage
   * @param folder   - S3 key prefix (e.g. 'devices', 'brands')
   * @param mimeType - MIME type of the file (e.g. 'image/jpeg')
   * @returns        - Public URL and S3 key
   */
  static async uploadToS3(
    buffer: Buffer,
    folder: string,
    mimeType: string,
  ): Promise<{ url: string; key: string }> {
    const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg';
    const key = `${folder}/${randomUUID()}.${ext}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket:      env.AWS_S3_BUCKET_NAME,
        Key:         key,
        Body:        buffer,
        ContentType: mimeType,
      }),
    );

    // Base URL already has trailing slash stripped in env.ts
    const url = `${env.AWS_S3_PUBLIC_BASE_URL}/${key}`;
    return { url, key };
  }

  /**
   * Delete a file from S3 by its key.
   * @param key - The S3 object key returned from uploadToS3
   */
  static async deleteFromS3(key: string): Promise<void> {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
        Key:    key,
      }),
    );
  }
}
