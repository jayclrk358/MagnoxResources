export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">{children}</div>
      <footer className="mt-10 text-center text-xs text-gray-600">
        MagnoxResources &middot; Minecraft server management tools
      </footer>
    </div>
  );
}
