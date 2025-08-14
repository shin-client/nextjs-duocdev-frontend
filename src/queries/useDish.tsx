import dishApiRequest from "@/apiRequests/dish";
import {
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type DishesQueryData = {
  payload: DishListResType;
};

type DishType = DishResType["data"]

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
    onSuccess: (newDish) => {
      queryClient.setQueryData(["dishes"], (oldData: DishesQueryData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          payload: {
            ...oldData.payload,
            data: [...oldData.payload.data, newDish.payload.data],
          },
        };
      });

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
    onSuccess: (updatedDish, variables) => {
      const { id } = variables;

      // Update specific dish cache
      queryClient.setQueryData(["dishes", id], updatedDish);

      // Update list cache
      queryClient.setQueryData(["dishes"], (oldData: DishesQueryData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          payload: {
            ...oldData.payload,
            data: oldData.payload.data.map((dish: DishType) =>
              dish.id === id ? updatedDish.payload.data : dish,
            ),
          },
        };
      });

      queryClient.invalidateQueries({ queryKey: ["dishes"] });
    },
  });
};

export const useDeleteDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => dishApiRequest.deleteDish(id),
    onMutate: async (deletedId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["dishes"] });

      const previousDishes = queryClient.getQueryData(["dishes"]);

      queryClient.setQueryData(["dishes"], (oldData: DishesQueryData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          payload: {
            ...oldData.payload,
            data: oldData.payload.data.filter(
              (dish: DishType) => dish.id !== deletedId,
            ),
          },
        };
      });

      return { previousDishes };
    },
    onSuccess: (data, deletedId) => {
      queryClient.removeQueries({
        queryKey: ["dishes", deletedId],
      });
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(["dishes"], context?.previousDishes);
    },
  });
};
