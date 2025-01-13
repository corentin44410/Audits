<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Audits</h1>
    
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <template v-for="audit in audits" :key="audit.id">
        <router-link
          :to="{ name: 'audit-management', params: { id: audit.id }}"
          class="group relative bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-sm"
        >
          <h2 class="text-xl font-semibold mb-2">{{ audit.name }}</h2>
          <p class="text-gray-600 mb-4">{{ formatDate(audit.date) }}</p>
          <div class="mb-4">
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div
                class="bg-blue-600 h-2.5 rounded-full"
                :style="{ width: `${audit.completion}%` }"
              ></div>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ audit.completion }}% complété</p>
          </div>
          <span class="text-blue-500">Voir l'audit →</span>
        </router-link>
      </template>

      <!-- Bouton Nouvel Audit -->
      <button
        @click="showNewAuditModal = true"
        class="flex flex-col items-center justify-center h-full min-h-[200px] bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span class="text-lg font-medium text-gray-600">Nouvel Audit</span>
      </button>
    </div>

    <!-- Modal nouveau audit -->
    <div v-if="showNewAuditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Nouvel Audit</h2>
        <input
          v-model="newAuditName"
          type="text"
          placeholder="Nom de l'audit"
          class="w-full p-4 border-2 rounded-xl mb-4 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
        >
        <div class="flex justify-end gap-4">
          <button
            @click="showNewAuditModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            @click="createNewAudit"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            :disabled="!newAuditName.trim()"
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuditStore } from '../stores/audit';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const router = useRouter();
const auditStore = useAuditStore();
const showNewAuditModal = ref(false);
const newAuditName = ref('');

const audits = computed(() => auditStore.audits);

onMounted(async () => {
  await auditStore.loadAudits();
});

const formatDate = (date: string) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr });
};

const createNewAudit = async () => {
  if (newAuditName.value.trim()) {
    const auditId = await auditStore.createAudit(newAuditName.value);
    showNewAuditModal.value = false;
    newAuditName.value = '';
    router.push({ name: 'audit-management', params: { id: auditId }});
  }
};
</script>

<style scoped>
.sortable-chosen {
  @apply scale-[1.02] shadow-sm;
}

.sortable-ghost {
  @apply opacity-50;
}

.sortable-drag {
  @apply rotate-1;
}
</style>