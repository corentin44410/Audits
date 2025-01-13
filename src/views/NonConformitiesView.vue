<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <router-link :to="`/audit/${route.params.id}`" class="text-blue-500 hover:text-blue-600">
        ← Retour à la gestion de l'audit
      </router-link>
    </div>

    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-6">Liste des non-conformités</h2>
      
      <div v-if="nonConformities.length === 0" class="text-gray-500 text-center py-8">
        Aucune non-conformité détectée
      </div>
      
      <div v-else class="space-y-6">
        <div
          v-for="nc in nonConformities"
          :key="`${nc.pageId}-${nc.questionId}`"
          class="border-b pb-6 last:border-b-0"
        >
          <h3 class="text-lg font-semibold mb-2">{{ nc.pageName }}</h3>
          <div class="bg-red-50 rounded-lg p-4">
            <p class="font-medium text-gray-800 mb-2">{{ nc.questionLabel }}</p>
            <p class="text-red-600 mb-4">Non-conformité détectée</p>
            
            <div class="ml-4">
              <p class="text-gray-600 mb-2">
                <span class="font-medium">Réponse :</span> 
                {{ nc.responseLabel }}
              </p>
              
              <div v-if="nc.comment" class="mb-2">
                <p class="font-medium text-gray-700">Commentaire :</p>
                <p class="text-gray-600">{{ nc.comment }}</p>
              </div>
              
              <div v-if="nc.action?.label" class="mt-4">
                <p class="font-medium text-gray-700">Plan d'action :</p>
                <p class="text-gray-600">{{ nc.action.label }}</p>
                <p class="text-sm text-gray-500">
                  Échéance : {{ formatDate(nc.action.dueDate) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuditStore } from '../stores/audit';
import questionnaire from '../data/questionnaire.json';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const route = useRoute();
const auditStore = useAuditStore();

const currentAudit = computed(() => {
  return auditStore.audits.find(a => a.id === route.params.id);
});

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
};

const nonConformities = computed(() => {
  if (!currentAudit.value) return [];

  const ncs = [];

  for (const page of questionnaire.pages) {
    for (const question of page.questions) {
      const response = currentAudit.value.responses[question.id_question];
      if (!response) continue;

      let hasNonConformity = false;
      let responseLabel = '';

      if (question.format_question === 'RADIO') {
        const selectedResponse = question.reponses.find(r => r.valeur === response.value);
        if (selectedResponse?.attributs?.includes('Non conforme')) {
          hasNonConformity = true;
          responseLabel = selectedResponse.libelle_reponse;
        }
      } else if (question.format_question === 'CHECKBOX' && Array.isArray(response.value)) {
        const selectedResponses = question.reponses.filter(r => response.value.includes(r.id_reponse));
        const nonConformResponses = selectedResponses.filter(r => r.attributs?.includes('Non conforme'));
        if (nonConformResponses.length > 0) {
          hasNonConformity = true;
          responseLabel = nonConformResponses.map(r => r.libelle_reponse).join(', ');
        }
      }

      if (hasNonConformity) {
        ncs.push({
          pageId: page.id_page,
          pageName: page.titre_page,
          questionId: question.id_question,
          questionLabel: question.libelle_question,
          responseLabel,
          comment: response.comment,
          action: response.action
        });
      }
    }
  }

  return ncs;
});
</script>