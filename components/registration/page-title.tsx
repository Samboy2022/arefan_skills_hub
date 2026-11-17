export function RegistrationPageTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
    </div>
  );
}
