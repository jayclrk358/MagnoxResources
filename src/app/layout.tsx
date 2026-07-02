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
      <body className="min-h-screen antialiased">
        <div className="aurora-bg" aria-hidden="true">
          <div className="aurora-blob aurora-blob-1" />
          <div className="aurora-blob aurora-blob-2" />
          <div className="aurora-blob aurora-blob-3" />
        </div>
        {children}
      </body>
    </html>
  );
}
