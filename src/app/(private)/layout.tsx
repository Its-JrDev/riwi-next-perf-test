"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@/features/auth";
import { LanguageSwitcher } from "@/shared/components/language-switcher";
import { Button } from "@/shared/components/ui/button";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations("common");
  const { user, logout, loading } = useAuth();
  const homeHref = user
    ? user.role === "ADMIN"
      ? "/admin"
      : "/dashboard"
    : "/";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur support-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-6">
            <Link
              href={homeHref}
              className="flex items-center gap-2 font-bold text-lg"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black">
                C
              </div>
              <span>CoSpace</span>
            </Link>

            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link
                href="/dashboard"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("myReservations")}
              </Link>
              <Link
                href="/catalogo"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("exploreSpaces")}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              disabled={loading}
            >
              {loading ? "..." : t("logout")}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
