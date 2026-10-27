import {
  ArrowRight,
  Building2,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

const features = [
  {
    icon: Clock3,
    title: "Reserva en minutos",
    description:
      "Encuentra salas, escritorios y oficinas con disponibilidad real y confirma en segundos.",
  },
  {
    icon: ShieldCheck,
    title: "Ambientes confiables",
    description:
      "Espacios pensados para reuniones, trabajo individual y equipos en crecimiento.",
  },
  {
    icon: Wifi,
    title: "Conectividad total",
    description:
      "Internet rápido, iluminación adecuada y equipamiento listo para tu día productivo.",
  },
];

const stats = [
  { value: "250+", label: "espacios activos" },
  { value: "24/7", label: "acceso inteligente" },
  { value: "4.9/5", label: "valoración clientes" },
];

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col gap-20 pb-16">
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-zinc-100 via-background to-background dark:from-zinc-950 dark:via-background dark:to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(82,82,91,0.12),transparent_35%)]" />

        <div className="container relative mx-auto px-4 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {t("badge")}
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
              {t("titleLine1")}
              <span className="block bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 bg-clip-text text-transparent dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-500">
                {t("titleLine2")}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {t("subtitle")}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-2"
                >
                  {t("explore")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/register">{t("createAccount")}</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-2">
                <MapPin className="h-4 w-4 text-primary" />
                Ubicaciones premium
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-2">
                <Users className="h-4 w-4 text-primary" />
                Para equipos y personas
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="border-border/60 bg-card/80 shadow-sm"
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <p className="text-3xl font-black tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            {t("whyCoSpace")}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("whyCoSpace")}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="group border-border/60 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <CardContent className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-8">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="bg-gradient-to-br from-zinc-100 via-background to-background p-8 sm:p-10 dark:from-zinc-900/80 dark:via-background dark:to-background">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                {t("idealFor")}
              </p>
              <h3 className="mt-4 text-3xl font-bold tracking-tight">
                Equipos modernos y proyectos en movimiento
              </h3>
              <div className="mt-8 space-y-5 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-5 w-5 text-primary" />
                  <span>
                    Oficinas privadas para trabajo profundo, reuniones y
                    presentaciones.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 text-primary" />
                  <span>
                    Espacios flexibles para equipos híbridos y startups en
                    crecimiento.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
                  <span>
                    Experiencia premium con horarios accesibles y reservas
                    simplificadas.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center bg-muted/30 p-8">
              <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Disponibilidad
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    Abierto hoy
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Sala Ejecutiva
                    </p>
                    <p className="mt-2 text-xl font-bold">09:00 - 12:00</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Disponible · 2 puestos
                    </p>
                  </div>

                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Escritorio privado
                    </p>
                    <p className="mt-2 text-xl font-bold">13:00 - 17:00</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Disponible · Alta demanda
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-8">
        <div className="rounded-3xl bg-zinc-950 p-8 text-center text-white shadow-xl sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            {t("startToday")}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-300 sm:text-base">
            {t("ctaSubtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link href="/catalogo" className="inline-flex items-center gap-2">
                {t("explore")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/register">{t("createAccount")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
