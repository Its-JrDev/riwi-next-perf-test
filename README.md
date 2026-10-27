# CoSpace

CoSpace es una aplicación de coworking desarrollada con Next.js 16, Prisma y PostgreSQL. Permite a usuarios registrar cuentas, iniciar sesión, reservar espacios, cancelar sus reservas y gestionar el catálogo en función del rol. También incluye un panel administrativo para crear, editar y desactivar espacios, además de revisar reservas del sistema.

La app está orientada a un flujo real de negocio para espacios de trabajo flexibles: desks, salas, oficinas privadas y cabins.

## 1) Requisitos previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- Node.js 22 LTS o superior
- npm 10 o superior (o pnpm/yarn si prefieres otro gestor)
- Git
- Docker Desktop o Docker Engine
- Una cuenta en Supabase o una base PostgreSQL accesible
- Acceso a Vercel si vas a desplegar la app en producción

Recomendado:

- Visual Studio Code
- PostgreSQL client (opcional)
- Extensión de Prisma (opcional)

## 2) Tecnologías usadas

- Next.js 16 con App Router
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- shadcn-style UI components
- Lucide React
- Biome
- JWT con jose
- next-intl para internacionalización

## 3) Variables de entorno

Crea un archivo `.env` en la raíz del proyecto a partir de [.env.example](.env.example).

### Variables obligatorias

#### `DATABASE_URL`

- Tipo: string
- Descripción: cadena de conexión principal usada por la app y Prisma en runtime.
- Uso: conecta la app a PostgreSQL.
- Cómo obtenerla:
  - En Supabase, ve a Project Settings > Database > Connection string.
  - Usa la conexión del tipo Transaction / Pooler (PgBouncer), no la directa.
  - Ejemplo:

```bash
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

#### `DIRECT_URL`

- Tipo: string
- Descripción: conexión directa a PostgreSQL usada por Prisma CLI para migraciones y push.
- Uso: `npx prisma db push`, `npx prisma migrate dev`, `npx prisma generate`.
- Cómo obtenerla:
  - En Supabase, sigue la misma sección de Database y copia la Direct connection string.
  - Ejemplo:

```bash
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

#### `JWT_ACCESS_SECRET`

- Tipo: string
- Descripción: secreto que firma los access tokens del usuario.
- Uso: autentica requests y valida sesiones.
- Cómo generarlo:
  - Usa un valor largo y aleatorio.
  - Ejemplo práctico:

```bash
JWT_ACCESS_SECRET="cambialo-por-una-cadena-larga-y-aleatoria"
```

#### `JWT_REFRESH_SECRET`

- Tipo: string
- Descripción: secreto que firma los refresh tokens.
- Uso: renovar sesiones sin volver a iniciar sesión.
- Cómo generarlo:
  - Usa otro valor diferente al de `JWT_ACCESS_SECRET`.
  - Ejemplo:

```bash
JWT_REFRESH_SECRET="usa-otro-secreto-distinto-y-muy-seguro"
```

### Variables opcionales

#### `PORT`

- Default: `3000`
- Descripción: puerto del servidor local.

#### `ACCESS_TOKEN_EXPIRES_IN`

- Default: `15m`

#### `REFRESH_TOKEN_EXPIRES_IN`

- Default: `7d`

Ejemplo completo de `.env`:

```bash
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
JWT_ACCESS_SECRET="super-secreto-access-token-123"
JWT_REFRESH_SECRET="super-secreto-refresh-token-456"
PORT=3000
```

## 4) Ejecución en desarrollo

Sigue estos pasos en orden exacto.

### 4.1 Clonar el repositorio e instalar dependencias

```bash
git clone <URL_DEL_REPO>
cd riwi-next-perf-test
npm install
```

### 4.2 Crear el `.env`

Copia el ejemplo:

```bash
cp .env.example .env
```

Luego completa las variables con tus credenciales reales de PostgreSQL y JWT.

### 4.3 Ejecutar migraciones de Prisma

```bash
npx prisma generate
npx prisma db push
```

Si la base está vacía, el schema se crea con estas instrucciones.

### 4.4 Ejecutar el seed

```bash
npm run db:seed
```

Este comando crea el usuario administrador por defecto y varios espacios de ejemplo.

### 4.5 Levantar el proyecto en desarrollo

```bash
npm run dev
```

La app queda disponible en:

```text
http://localhost:3000
```

## 5) Credenciales del administrador

El seed crea un usuario administrador con estas credenciales:

- Email: `admin@cospace.com`
- Password: `Admin123456!`

Usa estas credenciales para iniciar sesión como administrador y acceder al panel de gestión.

## 6) Ejecución con Docker

### Opción A: levantar la app con Docker Compose

El proyecto incluye un `docker-compose.yml` para iniciar la app y la base de datos local.

Primero define los JWT secrets en tu shell o en un `.env` local del proyecto:

```bash
export JWT_ACCESS_SECRET="cambialo-por-un-secreto-muy-largo"
export JWT_REFRESH_SECRET="cambialo-por-otro-secreto-muy-largo"
```

Luego levanta los servicios:

```bash
docker compose up --build
```

Esto levanta:

- la app en `http://localhost:3000`
- una base PostgreSQL en `localhost:5432`

### Opción B: construir y correr la imagen manualmente

```bash
docker build -t cospace-app .
docker run --rm -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/app?schema=public" \
  -e DIRECT_URL="postgresql://postgres:postgres@host.docker.internal:5432/app?schema=public" \
  -e JWT_ACCESS_SECRET="tu-access-secret" \
  -e JWT_REFRESH_SECRET="tu-refresh-secret" \
  cospace-app
```

> Para una base local, usa `host.docker.internal` o apunta al contenedor de PostgreSQL correcto según tu entorno.

## 7) Scripts disponibles en package.json

- `npm run dev`: inicia el servidor de desarrollo con Turbopack.
- `npm run build`: genera una build de producción.
- `npm run start`: ejecuta la app compilada en modo producción.
- `npm run db:generate`: genera el cliente de Prisma.
- `npm run db:push`: aplica el schema al PostgreSQL actual.
- `npm run db:seed`: crea el usuario administrador y los espacios iniciales.
- `npm run db:studio`: abre Prisma Studio para inspeccionar la base de datos.
- `npm run lint`: ejecuta Biome para revisar calidad y estilo del código.
- `npm run typecheck`: ejecuta TypeScript para verificar que el proyecto compila correctamente.
- `npm run lint:fix`: corrige automáticamente problemas de estilo/imports del proyecto.

## 8) Estructura de carpetas

```text
.
├── .github/                # Workflows de CI/CD
├── prisma/                 # Schema y seed de Prisma
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── scripts/                # Scripts auxiliares del proyecto
├── src/
│   ├── app/                # Rutas de la app (App Router)
│   │   ├── (public)/       # Landing page y catálogo público
│   │   ├── (auth)/         # Login y registro
│   │   ├── (private)/      # Dashboard de cliente
│   │   ├── (admin)/        # Panel de administración
│   │   ├── api/            # APIs internas
│   │   └── globals.css
│   ├── features/           # Módulos por funcionalidad
│   │   ├── auth/
│   │   ├── reservations/
│   │   └── spaces/
│   ├── lib/                # Utilidades, DB y auth
│   ├── shared/             # Componentes reutilizables
│   ├── i18n/               # Traducciones y locale setup
│   ├── proxy.ts            # Middleware/guard de acceso
│   └── ...
├── Dockerfile              # Imagen de producción para Docker
├── docker-compose.yml      # Orquestación local con Postgres
├── next.config.ts          # Configuración de Next.js
├── package.json            # Scripts y dependencias
├── .env.example            # Variables de entorno base
├── README.md               # Documentación del proyecto
├── prisma.config.ts        # Config de Prisma
├── LICENSE                 # Licencia del proyecto
└── tsconfig.json
```

## 9) URL de la aplicación desplegada

Si la app se despliega en Vercel, la URL final será algo similar a:

```text
https://<nombre-del-proyecto>.vercel.app
```

En un entorno local, la URL es:

```text
http://localhost:3000
```

Si aún no se ha desplegado, la app está lista para ejecutarse localmente siguiendo este README.

## 10) Recomendación final

Este proyecto puede ejecutarse desde cero siguiendo este documento sin necesidad de leer código adicional. El flujo correcto es:

1. Instalar Node.js y Docker
2. Crear `.env` con las variable reales
3. Ejecutar `npx prisma db push`
4. Ejecutar `npm run db:seed`
5. Iniciar `npm run dev`

Si sigues todos estos pasos en orden, la app queda lista para usar.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.
