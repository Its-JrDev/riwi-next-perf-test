"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useAuth } from "../hooks/useAuth";
import { type LoginFormValues, loginSchema } from "../schemas/login.schema";

export interface LoginFormProps {
  defaultValues?: Partial<LoginFormValues>;
  onSubmit?: (data: LoginFormValues) => void | Promise<void>;
}

export function LoginForm({ defaultValues, onSubmit }: LoginFormProps) {
  const t = useTranslations("auth");
  const { login, loading, error: authError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      ...defaultValues,
    },
  });

  const handleFormSubmit = async (data: LoginFormValues) => {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      await login(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {authError && (
        <div className="rounded bg-destructive/15 p-3 text-xs font-medium text-destructive">
          {authError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="login-email">{t("emailLabel")}</Label>
        <Input
          id="login-email"
          type="email"
          placeholder={t("emailPlaceholder")}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs font-medium text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">{t("passwordLabel")}</Label>
        <Input
          id="login-password"
          type="password"
          placeholder={t("passwordPlaceholder")}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs font-medium text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t("loginLoading") : t("loginButton")}
      </Button>
    </form>
  );
}
