<template>
  <div class="bg-white rounded-lg p-4 flex items-center gap-3">
    <div :class="`p-2 rounded-lg ${bgColorClass}`">
      <!-- Calendar Icon -->
      <svg v-if="icon === 'calendar'" xmlns="http://www.w3.org/2000/svg" :class="`h-5 w-5 ${textColorClass}`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      
      <!-- Document Icon -->
      <svg v-else-if="icon === 'document'" xmlns="http://www.w3.org/2000/svg" :class="`h-5 w-5 ${textColorClass}`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      
      <!-- Progress Icon -->
      <svg v-else-if="icon === 'progress'" xmlns="http://www.w3.org/2000/svg" :class="`h-5 w-5 ${textColorClass}`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      
      <!-- Question Icon -->
      <svg v-else-if="icon === 'question'" xmlns="http://www.w3.org/2000/svg" :class="`h-5 w-5 ${textColorClass}`" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    
    <div class="flex-1 min-w-0">
      <p class="text-sm text-gray-500">{{ title }}</p>
      <div v-if="progress !== undefined" class="flex items-center gap-3">
        <div class="flex-1">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              :class="`${progressColorClass} h-2 rounded-full transition-all duration-300`"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
        </div>
        <span class="font-medium whitespace-nowrap">{{ progress }}%</span>
      </div>
      <p v-else class="font-medium truncate">{{ value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  icon: 'calendar' | 'document' | 'progress' | 'question';
  title: string;
  value?: string;
  progress?: number;
  color: 'blue' | 'purple' | 'green' | 'amber';
}>();

const bgColorClass = computed(() => {
  const colors = {
    blue: 'bg-blue-50',
    purple: 'bg-purple-50',
    green: 'bg-green-50',
    amber: 'bg-amber-50'
  };
  return colors[props.color];
});

const textColorClass = computed(() => {
  const colors = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    amber: 'text-amber-600'
  };
  return colors[props.color];
});

const progressColorClass = computed(() => {
  const colors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500'
  };
  return colors[props.color];
});
</script>