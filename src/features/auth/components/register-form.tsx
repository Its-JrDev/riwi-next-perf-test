"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useAuth } from "../hooks/useAuth";
import {
  type RegisterFormValues,
  registerSchema,
} from "../schemas/register.schema";

export interface RegisterFormProps {
  defaultValues?: Partial<RegisterFormValues>;
  onSubmit?: (data: RegisterFormValues) => void | Promise<void>;
}

export function RegisterForm({ defaultValues, onSubmit }: RegisterFormProps) {
  const t = useTranslations("auth");
  const { register: registerUser, loading, error: authError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      ...defaultValues,
    },
  });

  const handleFormSubmit = async (data: RegisterFormValues) => {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      await registerUser(data);
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
        <Label htmlFor="register-name">{t("fullNameLabel")}</Label>
        <Input
          id="register-name"
          type="text"
          placeholder={t("namePlaceholder")}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs font-medium text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">{t("emailLabel")}</Label>
        <Input
          id="register-email"
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
        <Label htmlFor="register-password">{t("passwordLabel")}</Label>
        <Input
          id="register-password"
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
        {loading ? t("registerLoading") : t("registerButton")}
      </Button>
    </form>
  );
}
