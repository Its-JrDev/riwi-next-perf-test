"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type * as React from "react";
import { cn } from "@/lib/utils";

export interface AuthSplitProps {
  className?: string;
  brand?: {
    name: string;
    logo?: React.ReactNode;
    href?: string;
  };
  testimonial?: {
    quote: string;
    author: string;
    role?: string;
  };
  topAction?: {
    text: string;
    linkText: string;
    href: string;
  };
  children: React.ReactNode;
}

export function AuthSplit({
  className,
  brand = { name: "CoSpace", href: "/" },
  testimonial,
  topAction,
  children,
}: AuthSplitProps) {
  const t = useTranslations("auth");
  const resolvedTestimonial = testimonial ?? {
    quote: t("testimonialQuote"),
    author: t("testimonialAuthor"),
    role: t("testimonialRole"),
  };

  return (
    <div
      className={cn(
        "relative grid min-h-screen bg-background text-foreground lg:grid-cols-2",
        className,
      )}
    >
      <div className="relative hidden h-full flex-col justify-between bg-zinc-950 p-10 text-white lg:flex dark:border-r border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />

        <div className="relative z-20 flex items-center gap-2 text-lg font-bold">
          <Link href={brand.href || "/"} className="flex items-center gap-2">
            {brand.logo ?? (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-950 font-black text-base">
                C
              </div>
            )}
            <span>{brand.name}</span>
          </Link>
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg leading-relaxed text-zinc-300">
              &ldquo;{resolvedTestimonial.quote}&rdquo;
            </p>
            <footer className="text-sm">
              <span className="font-semibold text-white">
                {resolvedTestimonial.author}
              </span>
              {resolvedTestimonial.role && (
                <span className="text-zinc-400">
                  {" "}
                  &mdash; {resolvedTestimonial.role}
                </span>
              )}
            </footer>
          </blockquote>
        </div>
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 lg:min-h-screen">
        {topAction && (
          <div className="w-full max-w-md flex justify-end text-sm text-muted-foreground mb-4">
            <span>{topAction.text} </span>
            <Link
              href={topAction.href}
              className="ml-1 font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
            >
              {topAction.linkText}
            </Link>
          </div>
        )}

        <div className="w-full max-w-md">{children}</div>

        <p className="mt-6 px-8 text-center text-xs text-muted-foreground">
          {t("termsText")}{" "}
          <a
            href="#terms"
            className="underline underline-offset-4 hover:text-foreground"
          >
            {t("termsLink")}
          </a>{" "}
          y{" "}
          <a
            href="#privacy"
            className="underline underline-offset-4 hover:text-foreground"
          >
            {t("privacyLink")}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
