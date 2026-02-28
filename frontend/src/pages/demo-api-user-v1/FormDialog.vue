<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 500px; max-width: 700px">
      <q-card-section>
        <div class="text-h6">{{ isEdit ? 'Edit' : 'Create' }} Demo Api User V1</div>
      </q-card-section>

      <q-card-section class="scroll" style="max-height: 70vh">
        <q-form ref="formRef" @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.Age"
            label="Age"
            type="number"
            :rules="rules.Age"
          />
          <q-input
            v-model="form.Name"
            label="Name"
            :rules="rules.Name"
          />
          <q-select
            v-model="form.Status"
            label="Status"
            :options="[{ label: '0', value: '0' }, { label: '1', value: '1' }]"
            emit-value
            map-options
            :rules="rules.Status"
          />
          <q-expansion-item label="List" icon="data_object" header-class="text-primary" class="q-mb-sm" default-opened>
            <q-input
              v-model="form.list"
              type="textarea"
              autogrow
              dense
              hint="JSON format"
              :rules="rules.list"
              class="q-pa-sm"
            />
          </q-expansion-item>
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

import { useDemoApiUserV1 } from '../../composables/useDemoApiUserV1';

import { zodFormRules } from '../../utils/zod-to-quasar';


  
    import { PostUserBody,  } from '../../api/gen/zod/user/user';
  




import type { z } from 'zod';

// Infer form shape from Zod schema for type safety
type FormShape = z.infer<typeof PostUserBody >;

// Adjust form data type for JSON string handling in nested objects
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type FormData = FormShape & {
  list: string;
};

const props = defineProps<{
  modelValue: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
}>();

const emit = defineEmits(['saved', 'cancel']);


const saving = ref(false);

const isEdit = computed(() => props.item !== null);

// Define validation rules, combining manual and Zod-derived rules
const rules = computed(() => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const manualRules = {
    
    Age: [
    (val: any) => (val !== null && val !== undefined && val !== '') || 'Age is required',
  ],
    
    Name: [
    (val: any) => (val !== null && val !== undefined && val !== '') || 'Name is required',
  ],
    
    Status: [],
    
    list: [],
    
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  
  const schema = isEdit.value
    ? null
    : PostUserBody;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (schema && typeof (schema as any).shape === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { ...manualRules, ...zodFormRules(schema as any) };
  }
  

  return manualRules;
});

// Initialize empty form with default values

const emptyForm: FormData = {
  
  Age: 0,
  
  Name: '',
  
  Status: '',
  
  list: '{}',
  
};


const form = reactive<FormData>({ ...emptyForm });



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

function preparePayload(data: FormData): FormShape {
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
  return out as FormShape;
}

const { create, update } = useDemoApiUserV1();
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
      await update({ Id: props.item.Id, ...payload });
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