import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="page-shell flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-6">
      <div className="panel-glass rounded-2xl border px-8 py-10 text-center w-full max-w-md">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">404</h1>
        <p className="mb-5 text-lg text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline underline-offset-4 hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
