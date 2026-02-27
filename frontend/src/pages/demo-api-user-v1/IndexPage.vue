<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="text-h5">Demo Api User V1s</div>
      <q-space />
      <q-btn color="primary" icon="add" label="Create" @click="onCreate" />
    </div>

    <q-table
      :rows="items"
      :columns="columns"
      :loading="isLoading"
      row-key="Id"
      v-model:pagination="pagination"
      binary-state-sort
      @request="onRequest"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense icon="visibility" :to="'/demo-api-user-v1s/' + props.row.Id" />
          <q-btn flat dense icon="edit" @click="onEdit(props.row)" />
          <q-btn flat dense icon="delete" color="negative" @click="onDelete(props.row.Id)" />
        </q-td>
      </template>
    </q-table>

    <FormDialog v-model="dialogOpen" :item="editedItem" @saved="onSaved" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useDemoApiUserV1 } from '../../composables/useDemoApiUserV1';
import FormDialog from './FormDialog.vue';

const $q = useQuasar();
const { items, isLoading, pagination, onRequest, remove } = useDemoApiUserV1();

const dialogOpen = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editedItem = ref<any>(null);

const columns = [
  { name: 'Age', label: 'Age', field: 'Age', sortable: true, align: 'right' as const },
  { name: 'Id', label: 'Id', field: 'Id', sortable: true, align: 'right' as const },
  { name: 'Name', label: 'Name', field: 'Name', sortable: true, align: 'left' as const },
  { name: 'Status', label: 'Status', field: 'Status', sortable: true, align: 'left' as const },
  { name: 'list', label: 'List', field: 'list', sortable: false, align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' as const },
];

function onCreate() {
  editedItem.value = null;
  dialogOpen.value = true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onEdit(row: any) {
  editedItem.value = { ...row };
  dialogOpen.value = true;
}

function onSaved() {
  dialogOpen.value = false;
  editedItem.value = null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onDelete(id: any) {
  $q.dialog({
    title: 'Confirm',
    message: 'Delete this demoApiUserV1?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void remove(id);
  });
}
</script>
