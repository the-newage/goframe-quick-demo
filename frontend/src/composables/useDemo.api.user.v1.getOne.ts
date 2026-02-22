// Auto-generated composable for Demo.api.user.v1.getOne — do not edit manually.
//
// TYPE-SAFE REWIRING (after running Orval):
//   import type { Demo.api.user.v1.getOne } from '../api/gen/schemas';
//   const items = computed<Demo.api.user.v1.getOne[]>(() => listData.value || []);
//
import { ref, computed, type Ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import api, { unwrap } from '../api/client';

const ENTITY_PATH = '/api/demo.api.user.v1.get-ones';
const QUERY_KEY = 'demo.api.user.v1.getOnes';

export function useDemo.api.user.v1.getOne() {
  const queryClient = useQueryClient();

  const pagination = ref({
    page: 1,
    rowsPerPage: 15,
    rowsNumber: 0,
    sortBy: 'Id',
    descending: false,
  });

  const queryKey = computed(() => [
    QUERY_KEY,
    pagination.value.page,
    pagination.value.rowsPerPage,
    pagination.value.sortBy,
    pagination.value.descending,
  ]);

  const { data: listData, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const p = pagination.value;
      const res = await api.get(ENTITY_PATH, {
        params: {
          page: p.page,
          pageSize: p.rowsPerPage,
          orderBy: p.sortBy,
          orderDirection: p.descending ? 'desc' : 'asc',
        },
      });
      const payload = unwrap<any>(res);
      const list = Array.isArray(payload) ? payload : payload?.list || payload?.items || [];
      const total = payload?.total ?? payload?.totalCount ?? list.length;
      pagination.value.rowsNumber = total;
      return list;
    },
  });

  const items = computed(() => listData.value || []);

  function onRequest(props: { pagination: typeof pagination.value }) {
    pagination.value = { ...props.pagination };
  }

  function useItem(id: Ref<string | number>) {
    return useQuery({
      queryKey: computed(() => [QUERY_KEY, id.value]),
      queryFn: async () => {
        if (!id.value) return null;
        const res = await api.get(ENTITY_PATH + '/' + id.value);
        return unwrap<any>(res);
      },
      enabled: computed(() => !!id.value),
    });
  }

  const { mutateAsync: create } = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(ENTITY_PATH, data);
      return unwrap<any>(res);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutateAsync: update } = useMutation({
    mutationFn: async (data: any) => {
      const { Id: id, ...body } = data;
      const res = await api.put(ENTITY_PATH + '/' + id, body);
      return unwrap<any>(res);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  const { mutateAsync: remove } = useMutation({
    mutationFn: async (id: string | number) => {
      const res = await api.delete(ENTITY_PATH + '/' + id);
      return unwrap<any>(res);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });

  return { items, isLoading, pagination, onRequest, useItem, create, update, remove };
}
