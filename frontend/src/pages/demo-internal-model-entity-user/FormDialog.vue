<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 500px; max-width: 700px">
      <q-card-section>
        <div class="text-h6">{{ isEdit ? 'Edit' : 'Create' }} Demo Internal Model Entity User</div>
      </q-card-section>

      <q-card-section class="scroll" style="max-height: 70vh">
        <q-form ref="formRef" @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.age"
            label="Age"
            type="number"
            :rules="rules.age"
          />
          <q-input
            v-model="form.name"
            label="Name"
            :rules="rules.name"
          />
          <q-input
            v-model="form.status"
            label="Status"
            type="number"
            :rules="rules.status"
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
import { ref, reactive, computed, watch } from 'vue'

import { useDemoInternalModelEntityUser } from '../../composables/useDemoInternalModelEntityUser'







const props = defineProps<{
  modelValue: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any | null;
}>();

const emit = defineEmits(['saved', 'cancel'])


const saving = ref(false)

const isEdit = computed(() => props.item !== null)

const rules = computed(() => {
  const manualRules = {
    
    age: [],
    
    name: [],
    
    status: [],
    
  }

  

  return manualRules
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const emptyForm: Record<string, any> = {
  
  age: 0,
  
  name: ' ',
  
  status: 0,
  
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const form = reactive<Record<string, any>>({ ...emptyForm });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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





// Parse JSON-string fields back to objects before sending to the API
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const { create, update } = useDemoInternalModelEntityUser();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formRef = ref<any>(null);

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
