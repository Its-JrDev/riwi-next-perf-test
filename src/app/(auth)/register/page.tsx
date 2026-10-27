"use client";

import { useTranslations } from "next-intl";
import { AuthCard, RegisterForm } from "@/features/auth";

export default function RegistroPage() {
  const t = useTranslations("auth");

  return (
    <AuthCard
      title={t("registerTitle")}
      description={t("registerDescription")}
      footerAction={{
        text: t("alreadyHaveAccount"),
        linkText: t("loginNow"),
        href: "/login",
      }}
    >
      <RegisterForm />
    </AuthCard>
  );
}
