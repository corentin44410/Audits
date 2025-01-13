<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-xl w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
      <p class="text-gray-600 mb-6">{{ message }}</p>
      <div class="flex justify-end gap-4">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Annuler
        </button>
        <button
          @click="$emit('confirm')"
          :class="[
            'px-4 py-2 rounded-lg',
            type === 'danger' 
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          ]"
        >
          Confirmer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  message: string;
  type?: 'danger' | 'primary';
}>();

defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>