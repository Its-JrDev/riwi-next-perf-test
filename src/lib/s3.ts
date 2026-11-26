import { S3Client } from "@aws-sdk/client-s3";

export const s3Config = {
  region: process.env.AWS_REGION ?? "us-east-2",
  bucket: process.env.AWS_S3_BUCKET,
  publicBaseUrl:
    process.env.AWS_S3_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? null,
};

export const s3Client = new S3Client({
  region: s3Config.region,
});

export function getPublicImageUrl(key: string) {
  if (s3Config.publicBaseUrl) {
    return `${s3Config.publicBaseUrl}/${key}`;
  }

  return `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`;
}
