"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useAuth } from "@/features/auth";
import { AuthSplit } from "@/features/auth/components/auth-split";
import { LanguageSwitcher } from "@/shared/components/language-switcher";

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const t = useTranslations("auth");
  const { user } = useAuth();
  const homeHref = user
    ? user.role === "ADMIN"
      ? "/admin"
      : "/dashboard"
    : "/";

  return (
    <div className="relative">
      <div className="absolute right-4 top-4 z-10">
        <LanguageSwitcher />
      </div>
      <AuthSplit
        brand={{ name: "CoSpace", href: homeHref }}
        testimonial={{
          quote: t("testimonialQuote"),
          author: t("testimonialAuthor"),
          role: t("testimonialRole"),
        }}
      >
        {children}
      </AuthSplit>
    </div>
  );
}
