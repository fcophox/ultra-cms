#!/usr/bin/env node
/**
 * UltraCMS — asistente de inicialización para un proyecto nuevo.
 *
 * Tras usar el template ("Use this template") o clonar, ejecuta:
 *
 *   npm run init
 *
 * Pide las credenciales del Supabase de ESTE proyecto y el branding,
 * escribe apps/admin/.env.local y personaliza ultra.config.ts.
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, "apps/admin/.env.local");
const configPath = join(root, "ultra.config.ts");

const rl = createInterface({ input: stdin, output: stdout });

async function ask(question, { required = false, fallback = "" } = {}) {
  while (true) {
    const suffix = fallback ? ` (${fallback})` : "";
    const answer = (await rl.question(`${question}${suffix}: `)).trim();
    if (answer) return answer;
    if (fallback) return fallback;
    if (!required) return "";
    console.log("  ⚠ Este valor es obligatorio.");
  }
}

console.log("\n🚀 UltraCMS — inicialización del proyecto\n");
console.log("Necesitas un proyecto en Supabase. Sus credenciales están en");
console.log("Supabase → Project Settings → API.\n");

if (existsSync(envPath)) {
  const overwrite = await ask(
    "Ya existe apps/admin/.env.local. ¿Sobrescribir? (s/N)",
    { fallback: "N" },
  );
  if (!/^s/i.test(overwrite)) {
    console.log("\nCancelado. No se modificó .env.local.\n");
    rl.close();
    process.exit(0);
  }
}

console.log("\n── Credenciales de Supabase ──");
const url = await ask("Project URL (https://xxxx.supabase.co)", {
  required: true,
});
const anonKey = await ask("anon / public key", { required: true });
const serviceKey = await ask("service_role key", { required: true });

console.log("\n── Branding (opcional, Enter para usar el valor por defecto) ──");
const brandName = await ask("Nombre de la marca", { fallback: "UltraCMS" });
const primaryColor = await ask("Color primario (hex)", { fallback: "#4f46e5" });

// 1) Escribir .env.local
const envContent = `# UltraCMS — credenciales del Supabase de ESTE proyecto.
NEXT_PUBLIC_SUPABASE_URL=${url}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=${serviceKey}
`;
writeFileSync(envPath, envContent);
console.log("\n✓ apps/admin/.env.local escrito");

// 2) Personalizar ultra.config.ts (branding)
if (existsSync(configPath)) {
  let config = readFileSync(configPath, "utf8");
  config = config.replace(
    /name:\s*"[^"]*",(\s*\n\s*primaryColor)/,
    `name: ${JSON.stringify(brandName)},$1`,
  );
  config = config.replace(
    /primaryColor:\s*"[^"]*"/,
    `primaryColor: ${JSON.stringify(primaryColor)}`,
  );
  writeFileSync(configPath, config);
  console.log("✓ ultra.config.ts personalizado");
}

rl.close();

console.log(`
✅ Listo. Próximos pasos:

  1. Aplica el esquema a tu Supabase (una de las dos opciones):
       • SQL Editor: pega supabase/migrations/0001_init.sql y ejecútalo
       • CLI:        npx supabase link --project-ref <ref> && npx supabase db push

  2. Crea tu usuario admin en Supabase → Authentication → Add user
     (marca "Auto Confirm User").

  3. Levanta el panel:
       npm run dev
`);
