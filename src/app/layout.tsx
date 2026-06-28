import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MagnoxResources",
  description: "Configuration panel for Magnox plugins",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
