import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

export const ErrorPage = () => {
  const routeError = useRouteError();

  if (isRouteErrorResponse(routeError)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2">
        <h1 className="text-center text-xl font-medium">
          {routeError.status} {routeError.statusText}
        </h1>
        <Link className="text-blue-400 hover:underline text-center" to="/">
          Go back home
        </Link>
      </div>
    );
  }

  if (routeError instanceof Error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2">
        <h1 className="text-center text-xl font-medium">
          {routeError.message}
        </h1>
        <Link className="text-blue-400 hover:underline text-center" to="/">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2">
      <h1 className="text-center text-xl font-medium">Unknown error</h1>
      <Link className="text-blue-400 hover:underline text-center" to="/">
        Go back home
      </Link>
    </div>
  );
};
