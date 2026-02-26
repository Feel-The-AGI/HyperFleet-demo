import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="page-shell flex min-h-[calc(100svh-4.25rem)] items-center justify-center">
      <div className="surface-raised w-full max-w-2xl rounded-3xl p-10 text-center">
        <p className="page-eyebrow">HyperFleet</p>
        <h1 className="page-title mt-2">Emerald Operations Platform</h1>
        <p className="page-subtitle mx-auto mt-3">
          Use the left navigation to enter fleet map, dispatch controls, intelligence workflows, and reporting modules.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild>
            <a href="/fleet-map">Open Fleet Map</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/trips">Open Trips</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
