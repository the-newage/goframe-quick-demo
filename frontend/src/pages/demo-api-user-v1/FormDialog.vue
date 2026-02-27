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
import { ref, reactive, computed, watch } from 'vue'

import { useDemoApiUserV1 } from '../../composables/useDemoApiUserV1'

import { zodFormRules } from '../../utils/zod-to-quasar'


  
    import { PostUserBody,  } from '../../api/gen/zod/user/user'
  




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
    
    Age: [
    (val: any) => (val !== null && val !== undefined && val !== '') || 'Age is required',
  ],
    
    Name: [
    (val: any) => (val !== null && val !== undefined && val !== '') || 'Name is required',
  ],
    
    Status: [],
    
    list: [],
    
  }

  
  const schema = isEdit.value
    ? null
    : PostUserBody

  if (schema && typeof (schema as any).shape === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { ...manualRules, ...zodFormRules(schema as any) }
  }
  

  return manualRules
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const emptyForm: Record<string, any> = {
  
  Age: 0,
  
  Name: ' ',
  
  Status: ' ',
  
  list: '{}',
  
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

const { create, update } = useDemoApiUserV1();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formRef = ref<any>(null);

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
