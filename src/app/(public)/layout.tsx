"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth";
import { LanguageSwitcher } from "@/shared/components/language-switcher";
import { Button } from "@/shared/components/ui/button";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations("common");
  const { user, logout, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState("2026");

  useEffect(() => {
    setMounted(true);
    setCurrentYear(String(new Date().getFullYear()));
  }, []);

  const homeHref = user
    ? user.role === "ADMIN"
      ? "/admin"
      : "/dashboard"
    : "/";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navbar Público Dinámico */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur support-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <Link
            href={homeHref}
            className="flex items-center gap-2 font-bold text-lg"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black">
              C
            </div>
            <span>CoSpace</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/catalogo"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("catalog")}
            </Link>

            <LanguageSwitcher />

            {user ? (
              <>
                <Button asChild size="sm" variant="outline">
                  <Link href={user.role === "ADMIN" ? "/admin" : "/dashboard"}>
                    {t("dashboard")}
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => logout()}
                  disabled={loading}
                >
                  {loading ? "..." : t("logout")}
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/login">{t("login")}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">{t("register")}</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <div className="container mx-auto flex flex-col items-center justify-center gap-1 px-4 sm:flex-row sm:gap-2">
          <span>© {mounted ? currentYear : "—"} CoSpace.</span>
          <span>{t("rightsReserved")}</span>
        </div>
      </footer>
    </div>
  );
}
