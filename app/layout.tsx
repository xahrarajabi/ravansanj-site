import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "روان‌سنج — ارزیابی حرفه‌ای شخصیت و خودشناسی",
    template: "%s | روان‌سنج",
  },
  description:
    "روان‌سنج؛ پلتفرم حرفه‌ای ارزیابی روان‌شناختی و خودشناسی برای فارسی‌زبانان",
  applicationName: "روان‌سنج",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "روان‌سنج",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "روان‌سنج — ارزیابی حرفه‌ای شخصیت و خودشناسی",
    description: "پلتفرم حرفه‌ای ارزیابی روان‌شناختی و خودشناسی",
    locale: "fa_IR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#161e2a" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('ravansanj-theme') || 'system';
    var dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        {/* BNazanin for systems that have it; Vazirmatn as reliable web fallback */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/vazirmatn@33.003/Vazirmatn-font-face.css"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
@font-face {
  font-family: 'BNazanin';
  src: local('B Nazanin'), local('BNazanin'), local('Nazanin');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'BNazanin';
  src: local('B Nazanin Bold'), local('BNazanin Bold'), local('Nazanin Bold');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}
            `,
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-bg antialiased text-text">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
