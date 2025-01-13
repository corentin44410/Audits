<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <router-link :to="`/audit/${route.params.id}`" class="text-blue-500 hover:text-blue-600">
        ← Retour à la gestion de l'audit
      </router-link>
    </div>

    <AuditSummary 
      :responses="currentAudit?.responses || []" 
      :audit-id="route.params.id as string"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuditStore } from '../stores/audit';
import AuditSummary from '../components/AuditSummary.vue';

const route = useRoute();
const auditStore = useAuditStore();

const currentAudit = computed(() => {
  return auditStore.audits.find(a => a.id === route.params.id);
});
</script>