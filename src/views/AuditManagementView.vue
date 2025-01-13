<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <router-link to="/" class="text-blue-500 hover:text-blue-600 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour aux audits
      </router-link>
    </div>

    <div v-if="currentAudit" class="max-w-5xl mx-auto space-y-6">
      <!-- En-tête avec les informations de l'audit -->
      <div class="bg-white rounded-2xl p-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 class="text-2xl font-bold mb-2">{{ currentAudit.name }}</h1>
            <p class="text-gray-600">{{ questionnaire.titre_questionnaire }} (v{{ questionnaire.version_questionnaire }})</p>
          </div>
          <span 
            :class="[
              'px-3 py-1 text-sm font-medium rounded-full',
              currentAudit.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            ]"
          >
            {{ currentAudit.status === 'draft' ? 'Brouillon' : 'Publié' }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard
            icon="calendar"
            title="Date de début"
            :value="formatDate(currentAudit.date)"
            color="blue"
          />
          <InfoCard
            icon="document"
            title="Questionnaire"
            :value="questionnaire.titre_questionnaire"
            color="purple"
          />
          <InfoCard
            icon="progress"
            title="Progression"
            :progress="currentAudit.completion"
            color="green"
          />
          <InfoCard
            icon="question"
            title="Questions répondues"
            :value="`${currentAudit.responses.length}/${totalQuestions}`"
            color="amber"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap gap-4">
        <button
          @click="router.push(`/audit/${currentAudit.id}/questions`)"
          class="flex-1 flex items-center justify-center gap-2 p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Continuer l'audit
        </button>

        <button
          @click="router.push(`/audit/${currentAudit.id}/summary`)"
          class="flex-1 flex items-center justify-center gap-2 p-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Voir le récapitulatif
        </button>

        <button
          @click="router.push(`/audit/${currentAudit.id}/non-conformities`)"
          class="flex-1 flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Voir les non-conformités
        </button>
      </div>

      <!-- Signature -->
      <div class="bg-white rounded-2xl p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Signature</h2>
          <button
            @click="showSignatureModal = true"
            class="text-blue-500 hover:text-blue-600 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {{ currentAudit.signature ? 'Modifier la signature' : 'Ajouter une signature' }}
          </button>
        </div>
        
        <div v-if="currentAudit.signature" class="mb-4">
          <img :src="currentAudit.signature" alt="Signature" class="max-w-md rounded-xl" />
        </div>
        <p v-else class="text-gray-500 italic">Aucune signature</p>
      </div>

      <!-- Actions supplémentaires -->
      <div class="flex flex-wrap gap-4">
        <button
          @click="confirmPublish"
          class="flex-1 flex items-center justify-center gap-2 p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentAudit.completion < 100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Publier l'audit
        </button>

        <button
          @click="confirmDelete"
          class="flex items-center justify-center gap-2 p-4 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Supprimer l'audit
        </button>
      </div>
    </div>

    <!-- Modals -->
    <SignatureModal
      v-if="showSignatureModal"
      :audit="currentAudit"
      @save="saveSignature"
      @close="showSignatureModal = false"
    />

    <ConfirmationModal
      v-if="showDeleteModal"
      title="Confirmer la suppression"
      message="Êtes-vous sûr de vouloir supprimer cet audit ? Cette action est irréversible."
      @confirm="deleteAudit"
      @cancel="showDeleteModal = false"
    />

    <ConfirmationModal
      v-if="showPublishModal"
      title="Confirmer la publication"
      message="Êtes-vous sûr de vouloir publier cet audit ? Une fois publié, l'audit ne pourra plus être modifié."
      @confirm="publishAudit"
      @cancel="showPublishModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuditStore } from '../stores/audit';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import questionnaire from '../data/questionnaire.json';
import InfoCard from '../components/InfoCard.vue';
import SignatureModal from '../components/SignatureModal.vue';
import ConfirmationModal from '../components/ConfirmationModal.vue';

const route = useRoute();
const router = useRouter();
const auditStore = useAuditStore();

const showDeleteModal = ref(false);
const showPublishModal = ref(false);
const showSignatureModal = ref(false);

const currentAudit = computed(() => {
  return auditStore.audits.find(a => a.id === route.params.id);
});

const totalQuestions = computed(() => {
  return questionnaire.pages.reduce((total, page) => total + page.questions.length, 0);
});

const formatDate = (date: string) => {
  return format(new Date(date), 'dd MMMM yyyy à HH:mm', { locale: fr });
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const deleteAudit = () => {
  auditStore.deleteAudit(route.params.id as string);
  showDeleteModal.value = false;
  router.push('/');
};

const confirmPublish = () => {
  if (currentAudit.value?.completion === 100) {
    showPublishModal.value = true;
  }
};

const publishAudit = () => {
  auditStore.publishAudit(route.params.id as string);
  showPublishModal.value = false;
  router.push('/');
};

const saveSignature = (signature: string) => {
  if (currentAudit.value) {
    auditStore.updateAuditSignature(currentAudit.value.id, signature);
    showSignatureModal.value = false;
  }
};
</script>
