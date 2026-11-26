import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const awsRegion = process.env.AWS_REGION ?? "us-east-2";
const awsBucket = process.env.AWS_S3_BUCKET;
const publicHostname = process.env.AWS_S3_PUBLIC_BASE_URL
  ? new URL(process.env.AWS_S3_PUBLIC_BASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  /* Turbopack configuration */
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(awsBucket
        ? [
            {
              protocol: "https" as const,
              hostname: `${awsBucket}.s3.${awsRegion}.amazonaws.com`,
            },
          ]
        : []),
      ...(publicHostname
        ? [
            {
              protocol: "https" as const,
              hostname: publicHostname,
            },
          ]
        : []),
      {
        protocol: "https",
        hostname:
          "my-first-s3-089601768983-us-east-2-an.s3.us-east-2.amazonaws.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
