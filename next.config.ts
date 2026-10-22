import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  /** pdfkit lädt seine Schriftdateien zur Laufzeit (QR-Rechnung als PDF, `app/api/donacione/qr-bill`). */
  serverExternalPackages: ["pdfkit"],
  /** Nur für `next dev`: lokale Vorschau über einen Cloudflare-Quick-Tunnel teilen. */
  allowedDevOrigins: ["*.trycloudflare.com"],
  /** Sicherheits-Header für alle Seiten und API-Routen. */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Seite darf nicht in fremde Seiten eingebettet werden (Clickjacking auf Bezahlformularen).
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          // Browser soll den Content-Type nicht erraten (Medien-Routen liefern Dateien aus der DB).
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
