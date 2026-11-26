"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { type ChangeEvent, type ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useSpaces } from "../hooks/useSpaces";
import { type SpaceFormValues, spaceSchema } from "../schemas/space.schema";
import type { Space } from "../types";

interface SpaceFormDialogProps {
  space?: Space;
  trigger?: ReactNode;
  onSaved?: () => void;
}

const defaultValues: SpaceFormValues = {
  name: "",
  description: "",
  type: "DESK",
  pricePerHour: 15000,
  imageUrl: "",
};

export function SpaceFormDialog({
  space,
  trigger,
  onSaved,
}: SpaceFormDialogProps) {
  const t = useTranslations("catalog");
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { createSpace, updateSpace, loading, error } = useSpaces();
  const isEditing = Boolean(space);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SpaceFormValues>({
    resolver: zodResolver(spaceSchema),
    defaultValues,
  });

  const imageUrl = watch("imageUrl");

  useEffect(() => {
    if (space) {
      reset({
        name: space.name,
        description: space.description,
        type: space.type,
        pricePerHour: Number(space.pricePerHour),
        imageUrl: space.imageUrl,
      });
      return;
    }

    reset(defaultValues);
  }, [space, reset]);

  const onSubmit = async (data: SpaceFormValues) => {
    try {
      if (space) {
        await updateSpace(space.id, data);
      } else {
        await createSpace(data);
      }

      reset(defaultValues);
      setOpen(false);
      onSaved?.();
    } catch {
      // El error es manejado por el hook useSpaces
    }
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/uploads/image", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(result.error || "No se pudo subir la imagen");
      }

      setValue("imageUrl", result.data.url, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (uploadException) {
      setUploadError(
        uploadException instanceof Error
          ? uploadException.message
          : "No se pudo subir la imagen",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>{isEditing ? t("editSpace") : `+ ${t("newSpace")}`}</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("editSpace") : t("createCoworkingSpace")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {error && (
            <div className="rounded bg-destructive/15 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="name">{t("spaceName")}</Label>
            <Input
              id="name"
              placeholder="Ej: Sala Innovación"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="type">{t("spaceType")}</Label>
            <select
              id="type"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              {...register("type")}
            >
              <option value="DESK">{t("typeDesk")} (DESK)</option>
              <option value="MEETING_ROOM">
                {t("typeMeetingRoom")} (MEETING_ROOM)
              </option>
              <option value="PRIVATE_OFFICE">
                {t("typePrivateOffice")} (PRIVATE_OFFICE)
              </option>
              <option value="BOOTH">{t("typeBooth")} (BOOTH)</option>
            </select>
            {errors.type && (
              <p className="text-xs text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="pricePerHour">{t("pricePerHour")}</Label>
            <Input
              id="pricePerHour"
              type="number"
              placeholder="15000"
              {...register("pricePerHour")}
            />
            {errors.pricePerHour && (
              <p className="text-xs text-destructive">
                {errors.pricePerHour.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageFile">Imagen del espacio</Label>
            <Input
              id="imageFile"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading || loading}
              onChange={handleImageChange}
            />
            <input type="hidden" {...register("imageUrl")} />

            {uploading && (
              <p className="text-xs text-muted-foreground">
                Subiendo imagen...
              </p>
            )}
            {uploadError && (
              <p className="text-xs text-destructive">{uploadError}</p>
            )}
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Vista previa del espacio"
                className="h-36 w-full rounded-md border object-cover"
              />
            )}
            {errors.imageUrl && (
              <p className="text-xs text-destructive">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">{t("description")}</Label>
            <textarea
              id="description"
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder={t("placeholderDescription")}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? t("saving")
                : isEditing
                  ? t("saveChanges")
                  : t("createSpace")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
