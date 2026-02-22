<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <div class="text-h5">Demo.internal.model.entity.users</div>
      <q-space />
      <q-btn color="primary" icon="add" label="Create" @click="onCreate" />
    </div>

    <q-table
      :rows="items"
      :columns="columns"
      :loading="isLoading"
      row-key="id"
      v-model:pagination="pagination"
      binary-state-sort
      @request="onRequest"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense icon="visibility" :to="'/demo.internal.model.entity.users/' + props.row.id" />
          <q-btn flat dense icon="edit" @click="onEdit(props.row)" />
          <q-btn flat dense icon="delete" color="negative" @click="onDelete(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <FormDialog v-model="dialogOpen" :item="editedItem" @saved="onSaved" />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useDemo.internal.model.entity.user } from '../../composables/useDemo.internal.model.entity.user';
import FormDialog from './FormDialog.vue';

const $q = useQuasar();
const { items, isLoading, pagination, onRequest, remove } = useDemo.internal.model.entity.user();

const dialogOpen = ref(false);
const editedItem = ref<any>(null);

const columns = [
  { name: 'age', label: 'Age', field: 'age', sortable: true, align: 'right' as const },
  { name: 'id', label: 'Id', field: 'id', sortable: true, align: 'right' as const },
  { name: 'name', label: 'Name', field: 'name', sortable: true, align: 'left' as const },
  { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'right' as const },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' as const },
];

function onCreate() {
  editedItem.value = null;
  dialogOpen.value = true;
}

function onEdit(row: any) {
  editedItem.value = { ...row };
  dialogOpen.value = true;
}

function onSaved() {
  dialogOpen.value = false;
  editedItem.value = null;
}

function onDelete(id: any) {
  $q.dialog({
    title: 'Confirm',
    message: 'Delete this demo.internal.model.entity.user?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    await remove(id);
  });
}
</script>
