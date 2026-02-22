<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <q-btn flat icon="arrow_back" label="Back" :to="'/demo.api.user.v1.get-ones'" />
      <q-space />
      <q-btn flat icon="edit" label="Edit" @click="onEdit" />
      <q-btn flat icon="delete" label="Delete" color="negative" @click="onDelete" />
    </div>

    <q-card v-if="item" flat bordered>
      <q-card-section>
        <div class="text-h6">Demo.api.user.v1.get One Detail</div>
      </q-card-section>
      <q-list separator>
        <q-item>
          <q-item-section>
            <q-item-label caption>Id</q-item-label>
            <q-item-label>{{ item.Id }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-inner-loading :showing="isLoading" />

    <FormDialog v-model="editDialogOpen" :item="editItem" @saved="onEditSaved" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useDemo.api.user.v1.getOne } from '../../composables/useDemo.api.user.v1.getOne';
import FormDialog from './FormDialog.vue';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const entityId = computed(() => route.params.id as string);
const { useItem, remove } = useDemo.api.user.v1.getOne();
const { data: itemData, isLoading } = useItem(entityId);
const item = computed(() => itemData.value || null);

const editDialogOpen = ref(false);
const editItem = ref<any>(null);

function formatNested(val: any): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val, null, 2);
  return String(val);
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(url);
}

function onEdit() {
  editItem.value = item.value ? { ...item.value } : null;
  editDialogOpen.value = true;
}

function onEditSaved() {
  editDialogOpen.value = false;
}

function onDelete() {
  $q.dialog({
    title: 'Confirm',
    message: 'Delete this demo.api.user.v1.getOne?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    await remove(entityId.value);
    router.push('/demo.api.user.v1.get-ones');
  });
}
</script>
