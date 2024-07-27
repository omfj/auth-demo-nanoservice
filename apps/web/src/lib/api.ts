import ky from "ky";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const authService = ky.extend({
  prefixUrl: import.meta.env.VITE_AUTH_SERVICE_URL,
  credentials: "include",
});

export const useAuthServiceInfo = () => {
  const { data: info, ...rest } = useQuery({
    queryKey: ["auth-service-info"],
    queryFn: () => authService.get("info").text(),
  });

  return {
    info,
    ...rest,
  };
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { data: auth, ...rest } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      return await authService
        .get("auth/user", {
          retry: 1,
        })
        .json<{
          id: string;
          username: string;
        }>()
        .catch(() => null);
    },
  });

  const signOut = async () => {
    await authService.post("auth/logout");
    queryClient.setQueryData(["auth"], null);
  };

  return {
    auth,
    signOut,
    ...rest,
  };
};

export const addService = ky.extend({
  prefixUrl: import.meta.env.VITE_ADD_SERVICE_URL,
  credentials: "include",
});

export const useAddServiceInfo = () => {
  const { data: info, ...rest } = useQuery({
    queryKey: ["add-service-info"],
    queryFn: () => addService.get("info").text(),
  });

  return {
    info,
    ...rest,
  };
};

export const useAddHistory = () => {
  const { data: history, ...rest } = useQuery({
    queryKey: ["add-history"],
    queryFn: async () => {
      return await addService
        .get("history", {
          retry: 1,
        })
        .json<
          Array<{
            id: string;
            a: number;
            b: number;
            result: number;
            userId: string;
          }>
        >();
    },
  });

  return {
    history,
    ...rest,
  };
};
