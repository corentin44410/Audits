<template>
  <div v-if="audit" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-xl w-full max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Signature</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <SignaturePad :width="600" :height="200" @save="handleSave" />
      <div class="flex justify-end gap-4 mt-4">
        <button @click="$emit('close')" class="px-4 py-2 text-gray-600 hover:text-gray-800">
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Audit } from '../types/questionnaire';
import SignaturePad from './SignaturePad.vue';

defineProps<{
  audit: Audit | null; // Allow null if audit is undefined
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', signature: string): void;
}>();

const handleSave = (signature: string) => {
  emit('save', signature);
};
</script>
