import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardRouteLoading() {
  return (
    <div className="flex items-center justify-center py-32">
      <LoadingSpinner size="lg" text="Carregando..." />
    </div>
  );
}
