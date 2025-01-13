<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <router-link :to="`/audit/${route.params.id}`" class="text-blue-500 hover:text-blue-600">
        ← Retour à la gestion de l'audit
      </router-link>
    </div>

    <AuditSummary :responses="currentAudit?.responses || []" :audit-id="route.params.id" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AuditSummary from '../components/AuditSummary.vue';
import { useAuditStore } from '../stores/audit';

const route = useRoute();
const auditStore = useAuditStore();

const currentAudit = computed(() => {
  return auditStore.audits.find(a => a.id === route.params.id);
});
</script>