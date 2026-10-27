"use client";

import { useTranslations } from "next-intl";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export interface AuthCardProps {
  className?: string;
  brand?: {
    name: string;
    logo?: React.ReactNode;
  };
  title?: string;
  description?: string;
  socialProviders?: {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  }[];
  footerAction?: {
    text: string;
    linkText: string;
    href: string;
  };
  children: React.ReactNode;
}

export function AuthCard({
  className,
  brand = { name: "CoSpace" },
  title,
  description,
  socialProviders,
  footerAction,
  children,
}: AuthCardProps) {
  const t = useTranslations("auth");

  const resolvedTitle = title ?? t("welcome");
  const resolvedDescription = description ?? t("loginDescription");
  const resolvedFooterAction = footerAction ?? {
    text: t("noAccount"),
    linkText: t("registerNow"),
    href: "/register",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-muted/40 p-4 sm:p-8 text-foreground",
        className,
      )}
    >
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          {brand.logo ?? (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-lg shadow-sm">
              C
            </div>
          )}
          <span className="font-semibold text-sm tracking-tight text-muted-foreground">
            {brand.name}
          </span>
        </div>

        <Card className="border-border/60 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-bold tracking-tight">
              {resolvedTitle}
            </CardTitle>
            {resolvedDescription && (
              <CardDescription>{resolvedDescription}</CardDescription>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {socialProviders && socialProviders.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-2">
                  {socialProviders.map((provider) => {
                    const Icon = provider.icon;
                    return (
                      <Button
                        key={provider.name}
                        variant="outline"
                        className="w-full gap-2 text-xs font-medium"
                        onClick={provider.onClick}
                      >
                        <Icon className="h-4 w-4" />
                        <span>
                          {t("continueWith")} {provider.name}
                        </span>
                      </Button>
                    );
                  })}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-medium">
                      {t("orContinueWith")}
                    </span>
                  </div>
                </div>
              </>
            )}

            {children}
          </CardContent>

          {resolvedFooterAction && (
            <CardFooter className="flex justify-center border-t py-4 text-xs text-muted-foreground">
              <span>{resolvedFooterAction.text} </span>
              <a
                href={resolvedFooterAction.href}
                className="ml-1 font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
              >
                {resolvedFooterAction.linkText}
              </a>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
