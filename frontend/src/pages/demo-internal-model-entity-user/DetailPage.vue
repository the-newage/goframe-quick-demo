<template>
  <q-page padding>
    <div class="row items-center q-mb-md">
      <q-btn flat icon="arrow_back" label="Back" :to="'/demo-internal-model-entity-users'" />
      <q-space />
      <q-btn flat icon="edit" label="Edit" @click="onEdit" />
      <q-btn flat icon="delete" label="Delete" color="negative" @click="onDelete" />
    </div>

    <q-card v-if="item" flat bordered>
      <q-card-section>
        <div class="text-h6">Demo Internal Model Entity User Detail</div>
      </q-card-section>
      <q-list separator>
        <q-item>
          <q-item-section>
            <q-item-label caption>Age</q-item-label>
            <q-item-label>{{ item.age }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Id</q-item-label>
            <q-item-label>{{ item.id }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Name</q-item-label>
            <q-item-label>{{ item.name }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>Status</q-item-label>
            <q-item-label>{{ item.status }}</q-item-label>
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
import { useDemoInternalModelEntityUser } from '../../composables/useDemoInternalModelEntityUser';
import FormDialog from './FormDialog.vue';





const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const entityId = computed(() => route.params.id as string);
const { useItem, remove } = useDemoInternalModelEntityUser();
const { data: itemData, isLoading } = useItem(entityId);
const item = computed(() => itemData.value || null);



const editDialogOpen = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editItem = ref<any>(null);





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
    message: 'Delete this demoInternalModelEntityUser?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void (async () => {
      await remove(entityId.value);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push('/demo-internal-model-entity-users');
    })();
  });
}
</script>
