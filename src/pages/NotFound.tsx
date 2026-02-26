import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="page-shell flex min-h-[calc(100svh-4.25rem)] items-center justify-center">
      <div className="surface-raised w-full max-w-md rounded-3xl p-10 text-center">
        <p className="page-eyebrow">Error</p>
        <h1 className="page-title mt-2">Page Not Found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The route <span className="font-mono">{location.pathname}</span> does not exist in this workspace.
        </p>
        <Button asChild className="mt-6">
          <a href="/">Return to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
