import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

export const useDeleteData = (key) => {
  const queryClient = useQueryClient();
console.log(key)
  return useMutation({
    mutationFn: async (id) => {
      console.log(`${key}/${id}`)
      const res = await api.delete(`${key}/${id}`);
     console.log(res)
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([key]);
    },
  });
};
