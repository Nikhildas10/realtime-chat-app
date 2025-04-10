import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type MutationParams<T> = {
  apiCall: (data: T) => Promise<any>;
  onSuccessMessage?: string;
  queryKeyToInvalidate?: string | string[];
  redirectTo?: string;
};

export const useGenericMutation = <T,>({
  apiCall,
  onSuccessMessage = "",
  queryKeyToInvalidate,
  redirectTo,
}: MutationParams<T>) => {
  const router = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: T) => {
      return await apiCall(data);
    },
    onMutate: () => {},
    onSettled: async (_, error: any) => {
      if (error) {
        if (error?.errors && Array.isArray(error.errors)) {
          error.errors.forEach((err: string) => toast.error(err));
        } else if (error?.message) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      } else {
        if (onSuccessMessage) {
          toast.success(onSuccessMessage);
        }
        if (redirectTo) {
          router(redirectTo);
        }
        if (queryKeyToInvalidate) {
          const queryKeys = Array.isArray(queryKeyToInvalidate)
            ? queryKeyToInvalidate
            : [queryKeyToInvalidate];

          await Promise.all(
            queryKeys.map((key) =>
              queryClient.invalidateQueries({ queryKey: [key] })
            )
          );
        }
      }
    },
  });

  return {
    ...mutation,
    status: mutation.status,
  };
};
