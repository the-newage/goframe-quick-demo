<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 500px; max-width: 700px">
      <q-card-section>
        <div class="text-h6">{{ isEdit ? 'Edit' : 'Create' }} User</div>
      </q-card-section>

      <q-card-section class="scroll" style="max-height: 70vh">
        <q-form ref="formRef" @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.age"
            label="Age"
            :rules="[]"
          />
          <q-input
            v-model="form.name"
            label="Name"
            :rules="[]"
          />
          <q-input
            v-model="form.status"
            label="Status"
            :rules="[]"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn color="primary" label="Save" :loading="saving" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useUser } from '../../composables/useUser';
import { fetchRelationOptions } from '../../api/client';

const props = defineProps<{
  modelValue: boolean;
  item: any | null;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'saved'): void;
}>();

const { create, update } = useUser();
const formRef = ref<any>(null);
const saving = ref(false);

const isEdit = computed(() => props.item !== null);

const emptyForm: Record<string, any> = {
  age: '',
  name: '',
  status: '',
};

const form = reactive<Record<string, any>>({ ...emptyForm });

const relationOpts = reactive<Record<string, any[]>>({
});

watch(() => props.item, (val) => {
  if (val) {
    const copy = { ...val };
    // Stringify embedded objects for JSON textarea editing
    for (const [k, v] of Object.entries(copy)) {
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
        copy[k] = JSON.stringify(v, null, 2);
      }
    }
    Object.assign(form, copy);
  } else {
    Object.assign(form, emptyForm);
  }
}, { immediate: true });

async function filterRelation(
  val: string,
  update: (fn: () => void) => void,
  fieldName: string,
  apiPath: string
) {
  const opts = await fetchRelationOptions(apiPath, val, 'name');
  update(() => { relationOpts[fieldName] = opts; });
}

function onFileUploaded(info: any, fieldName: string) {
  try {
    const res = JSON.parse(info.xhr.responseText);
    form[fieldName] = res?.data?.url || res?.url || '';
  } catch { form[fieldName] = ''; }
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(url);
}

// Parse JSON-string fields back to objects before sending to the API
function preparePayload(data: Record<string, any>): Record<string, any> {
  const out = { ...data };
  for (const [key, val] of Object.entries(out)) {
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
          (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try { out[key] = JSON.parse(trimmed); } catch { /* keep as string */ }
      }
    }
  }
  return out;
}

async function onSubmit() {
  const valid = await formRef.value?.validate();
  if (!valid) return;
  saving.value = true;
  try {
    const payload = preparePayload({ ...form });
    if (isEdit.value) {
      await update({ id: props.item.id, ...payload });
    } else {
      await create(payload);
    }
    emit('saved');
    emit('update:modelValue', false);
  } finally {
    saving.value = false;
  }
}
</script>
