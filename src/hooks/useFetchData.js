import { useQuery } from '@tanstack/react-query';
import api from './api';

export const useFetchData = (key, endpoint) => {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const res = await api.get(endpoint);
      return res.data;
    },
  });
};
