# Deploy en Vercel — un repo, varios proyectos

UltraCMS lo mantienes **tú** en un solo repositorio. Cada cliente es solo un
**Project de Vercel** que apunta a este mismo repo, con su propio Supabase.

> **Resultado:** haces `git push` a `main` una vez → **todos** los Projects de
> Vercel se reconstruyen y actualizan solos. No clonas ni tocas nada por cliente.

```
                 ┌─ Vercel Project "acme"  → Supabase Acme  → acme-cms.tudominio.com
repo ultra-cms ──┼─ Vercel Project "beta"  → Supabase Beta  → beta-cms.tudominio.com
   (rama main)   └─ Vercel Project "gamma" → Supabase Gamma → …
        │
        └── push a main → los 3 redeployan automáticamente
```

---

## Una vez por cliente / proyecto

### 1. Supabase del proyecto
Crea un proyecto en Supabase y aplica el esquema (ver [README](./README.md)):
SQL Editor con `supabase/migrations/*.sql`, o `npx supabase db push`. Crea el
usuario admin en Authentication.

### 2. Importar el repo en Vercel
1. Vercel → **Add New… → Project**.
2. Importa el repo **`fcophox/ultra-cms`** (el mismo, cada vez).
3. Ponle un nombre que identifique al cliente (ej. `acme-cms`).

### 3. Ajustes del Project (monorepo)

| Ajuste | Valor |
|---|---|
| Framework Preset | **Next.js** (autodetectado) |
| **Root Directory** | **`apps/admin`** ← importante |
| Build Command | *(por defecto)* `next build` |
| Install Command | *(por defecto)* — Vercel detecta los workspaces e instala desde la raíz |

> Con *Root Directory* en `apps/admin`, Vercel reconoce el monorepo de npm
> workspaces y resuelve todo solo. No necesitas `vercel.json`.

### 4. Variables de entorno
En **Settings → Environment Variables**, agrega estas **2** (scope *Production*
y *Preview*), tomadas del Supabase de este cliente (Project Settings → API):

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ…` (anon / public) |

> La `service_role` **no se usa** en el panel; no la pongas en Vercel.
> `NEXT_PUBLIC_APP_VERSION` se calcula sola en el build (no la agregues).

### 5. Deploy y dominio
1. **Deploy**. En ~1 min está arriba en `*.vercel.app`.
2. (Opcional) **Settings → Domains** → asigna `cms.cliente.com`.
3. Entra, inicia sesión con el admin del paso 1, y a gestionar contenido.

Repite los pasos 1–5 por cada cliente nuevo.

---

## Cómo se actualizan todos (lo importante)

Cada Project escucha la rama `main`. Tu flujo de release:

```bash
# 1. haces el cambio (color, feature, fix…)
# 2. subes la versión y anotas la mejora
#    apps/admin/package.json  →  "version": "0.3.0"
#    CHANGELOG.md             →  qué cambió
git commit -am "feat: …"
git push origin main
# → Vercel redepliega TODOS los Projects con el cambio
# → cada panel muestra "UltraCMS v0.3.0 · Novedades"
```

**Único paso manual** si la mejora trae cambios de base de datos: aplicar la
migración nueva a cada Supabase (`supabase db push` por proyecto). Esto se puede
automatizar con un GitHub Action — pendiente.

---

## Checklist por cliente
- [ ] Proyecto Supabase creado + esquema aplicado + usuario admin
- [ ] Project en Vercel importando `fcophox/ultra-cms`
- [ ] Root Directory = `apps/admin`
- [ ] 2 env vars (URL + anon key) del Supabase de este cliente
- [ ] Deploy OK + (opcional) dominio propio
