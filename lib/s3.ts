import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION || 'eu-north-1';

/** Имя бакета: поддерживаем AWS_S3_BUCKET_NAME и устаревший AWS_S3_BUCKET */
const BUCKET =
  process.env.AWS_S3_BUCKET_NAME || process.env.AWS_S3_BUCKET || 'tamshy-uploads';

const explicitCredentials =
  process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined;

const s3 = new S3Client({
  region,
  ...(explicitCredentials ? { credentials: explicitCredentials } : {}),
});

export function getPublicS3ObjectUrl(key: string): string {
  return `https://${BUCKET}.s3.${region}.amazonaws.com/${key}`;
}

export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return getPublicS3ObjectUrl(key);
}
