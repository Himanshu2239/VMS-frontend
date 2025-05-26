export function VisitorRegistrationLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
      <div className="loader h-16 w-16 border-primary"></div>
      <p className="mt-6 text-lg font-medium">
        Registering visitor and notifying employee...
      </p>
    </div>
  );
}
