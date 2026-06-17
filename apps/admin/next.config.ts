import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Versión del producto (apps/admin/package.json), leída en build. */
function appVersion(): string {
  try {
    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), "package.json"), "utf8"),
    );
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion(),
  },
};

export default nextConfig;
