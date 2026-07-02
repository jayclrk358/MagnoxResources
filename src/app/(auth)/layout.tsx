export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">{children}</div>
      <footer className="mt-10 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-sm font-bold text-white/60">
          <img src="/icon-magnoxresources.svg" alt="MagnoxResources" className="h-5 w-5 rounded" />
          MagnoxResources
        </div>
        <p className="text-xs text-gray-700">&copy; 2026 MagnoxResources &middot; Minecraft server management</p>
      </footer>
    </div>
  );
}
