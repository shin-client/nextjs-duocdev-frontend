import tableApiRequest from "@/apiRequests/table";
import { UpdateTableBodyType } from "@/schemaValidations/table.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTables = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: tableApiRequest.list,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTable = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ["tables", id],
    queryFn: () => tableApiRequest.getTable(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tableApiRequest.addTable,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
};

export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateTableBodyType & {
      id: number;
    }) => tableApiRequest.updateTable(id, body),
    onSuccess: (data, variables) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: ["tables"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["tables", id] });
    },
  });
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tableApiRequest.deleteTable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });
    },
  });
};
