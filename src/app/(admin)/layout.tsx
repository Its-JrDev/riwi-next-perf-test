"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@/features/auth";
import { LanguageSwitcher } from "@/shared/components/language-switcher";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

export default function AdminLayout({
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
      <header className="sticky top-0 z-40 border-b border-border/60 bg-muted/30 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link
              href={homeHref}
              className="flex items-center gap-2 font-bold text-lg"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black">
                C
              </div>
              <span>CoSpace</span>
            </Link>
            <Badge
              variant="destructive"
              className="border border-red-200/60 bg-red-100 text-[10px] font-black tracking-[0.18em] text-red-700 shadow-sm transition-none hover:bg-red-100 hover:text-red-700 dark:border-red-500/30 dark:bg-red-950/60 dark:text-red-200 dark:hover:bg-red-950/60 dark:hover:text-red-200"
            >
              {t("admin")}
            </Badge>

            <nav className="hidden sm:flex items-center gap-4 text-sm font-medium ml-4">
              <Link
                href="/admin"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("spaces")}
              </Link>
              <Link
                href="/admin/reservas"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("allReservations")}
              </Link>
              <Link
                href="/catalogo"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("catalog")}
              </Link>
              <Link
                href="/dashboard"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("dashboard")}
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
