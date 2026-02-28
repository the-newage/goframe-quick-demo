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
// FormDialog

import { ref, reactive, computed, watch } from 'vue';

import { useDemoInternalModelEntityUser } from '../../composables/useDemoInternalModelEntityUser';







const props = defineProps<{
  modelValue: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
}>();

const emit = defineEmits(['saved', 'cancel', 'update:modelValue']);


const saving = ref(false);

const isEdit = computed(() => props.item !== null);

// Define validation rules, combining manual and Zod-derived rules
const rules = computed(() => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const manualRules = {
    
    age: [],
    
    name: [],
    
    status: [],
    
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  

  return manualRules;
});

// Initialize empty form with default values
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const emptyForm: Record<string, any> = {
  
  age: 0,
  
  name: '',
  
  status: 0,
  
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const form = reactive<Record<string, any>>({ ...emptyForm });



// Watch for item changes to populate or reset form
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





// Prepare form data for API submission by parsing JSON strings
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

// Handle form submission for create or update operations
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
