import dishApiRequest from "@/apiRequests/dish";
import { UpdateDishBodyType } from "@/schemaValidations/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDishes = () => {
  return useQuery({
    queryKey: ["dishes"],
    queryFn: dishApiRequest.list,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDish = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ["dishes", id],
    queryFn: () => dishApiRequest.getDish(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishApiRequest.addDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
    },
    onError: (error) => {
      console.error("Failed to create dish:", error);
    },
  });
};

export const useUpdateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateDishBodyType & {
      id: number;
    }) => dishApiRequest.updateDish(id, body),
    onSuccess: (data, variables) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: ["dishes"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["dishes", id] });
    },
  });
};

export const useDeleteDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dishApiRequest.deleteDish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
    },
    onError: (error) => {
      console.error("Failed to delete dish:", error);
    },
  });
};
