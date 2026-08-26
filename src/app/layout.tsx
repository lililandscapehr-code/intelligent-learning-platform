import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Educational Platform Simulator",
  description: "Interactive visual outcomes dashboard for testing educational engines.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
