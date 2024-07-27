import { Outlet } from "react-router-dom";
import { Header } from "../components/header";
import { useAuth } from "../lib/api";
import { Loader } from "lucide-react";

export const DefaultLayout = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col gap-8 items-center justify-center">
        <Loader size={64} className="animate-spin" />

        <p className="text-center font-medium text-3xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto">
      <Header />

      <div className="p-10 flex flex-col gap-4">
        <Outlet />
      </div>
    </div>
  );
};
