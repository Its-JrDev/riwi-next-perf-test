"use client";

import { useTranslations } from "next-intl";
import { AuthCard, LoginForm } from "@/features/auth";

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <AuthCard
      title={t("loginTitle")}
      description={t("loginDescription")}
      footerAction={{
        text: t("noAccount"),
        linkText: t("registerNow"),
        href: "/register",
      }}
    >
      <LoginForm />
    </AuthCard>
  );
}
