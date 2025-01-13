<template>
  <div class="signature-pad">
    <canvas
      ref="canvas"
      class="border-2 border-gray-200 rounded-lg cursor-crosshair"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="stopDrawing"
    ></canvas>
    <div class="flex justify-between mt-4">
      <button
        @click="clear"
        class="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Effacer
      </button>
      <button
        @click="save"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Enregistrer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  width?: number;
  height?: number;
}>();

const emit = defineEmits<{
  (e: 'save', signature: string): void;
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);
let ctx: CanvasRenderingContext2D | null = null;
let lastX = 0;
let lastY = 0;

onMounted(() => {
  if (!canvas.value) return;
  
  canvas.value.width = props.width || 400;
  canvas.value.height = props.height || 200;
  
  ctx = canvas.value.getContext('2d');
  if (!ctx) return;
  
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
});

const startDrawing = (e: MouseEvent) => {
  isDrawing.value = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
};

const draw = (e: MouseEvent) => {
  if (!isDrawing.value || !ctx) return;
  
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  
  [lastX, lastY] = [e.offsetX, e.offsetY];
};

const handleTouchStart = (e: TouchEvent) => {
  e.preventDefault();
  if (!canvas.value) return;
  
  const touch = e.touches[0];
  const rect = canvas.value.getBoundingClientRect();
  
  [lastX, lastY] = [
    touch.clientX - rect.left,
    touch.clientY - rect.top
  ];
  
  isDrawing.value = true;
};

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault();
  if (!isDrawing.value || !ctx || !canvas.value) return;
  
  const touch = e.touches[0];
  const rect = canvas.value.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  
  [lastX, lastY] = [x, y];
};

const stopDrawing = () => {
  isDrawing.value = false;
};

const clear = () => {
  if (!ctx || !canvas.value) return;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
};

const save = () => {
  if (!canvas.value) return;
  const signature = canvas.value.toDataURL('image/png');
  emit('save', signature);
};
</script>

<style scoped>
.signature-pad canvas {
  touch-action: none;
}
</style>