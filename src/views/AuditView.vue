<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header fixe -->
    <div class="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <router-link :to="`/audit/${route.params.id}`" class="text-blue-500 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </router-link>
          <h1 class="text-lg font-medium">{{ currentPage?.titre_page }}</h1>
        </div>

        <button @click="showSummary = !showSummary" class="flex items-center px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <span class="mr-2">{{ showSummary ? 'Continuer l\'audit' : 'Voir le récapitulatif' }}</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="showSummary" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Contenu principal avec padding-top pour éviter le header -->
    <div class="pt-20">
      <div v-if="showSummary" class="max-w-4xl mx-auto">
        <AuditSummary :responses="currentAudit?.responses || []" :audit-id="route.params.id" />
      </div>

      <div v-else class="max-w-3xl mx-auto">
        <div class="mb-8">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" :style="{ width: `${pageProgress}%` }"></div>
          </div>
          <p class="text-sm text-gray-600 mt-1">Question {{ visibleQuestionIndex + 1 }} sur {{ totalVisibleQuestions }}</p>
        </div>

        <TransitionGroup :name="transitionName" mode="out-in" class="relative">
          <div v-if="currentQuestion && isQuestionVisible(currentQuestion)" :key="currentQuestion.id_question" class="space-y-6">
            <div>
              <h2 class="text-xl font-semibold mb-2">{{ currentQuestion.libelle_question }}</h2>
              <p v-if="currentQuestion.bulle_aide" class="text-gray-600">
                {{ currentQuestion.bulle_aide }}
              </p>
            </div>

            <div v-if="currentQuestion.format_question === 'RADIO'" class="grid gap-4">
              <button v-for="reponse in currentQuestion.reponses" :key="reponse.id_reponse" @click="updateResponse(reponse.valeur)" class="option-button" :class="[
                'p-4 text-left rounded-2xl transition-all duration-200 border-2',
                currentResponse?.Valeur === reponse.valeur
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              ]">
                {{ reponse.libelle_reponse }}
              </button>
            </div>

            <div v-else-if="currentQuestion.format_question === 'CHECKBOX'" class="grid gap-4">
              <button v-for="reponse in currentQuestion.reponses" :key="reponse.id_reponse" @click="toggleCheckboxResponse(reponse.id_reponse)" class="option-button" :class="[
                'p-4 text-left rounded-2xl transition-all duration-200 border-2',
                isChecked(reponse.id_reponse)
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              ]">
                {{ reponse.libelle_reponse }}
              </button>
            </div>

            <div v-else-if="currentQuestion.format_question === 'TIME'">
              <input type="time" v-model="currentResponse.Valeur" class="w-full p-4 border-2 rounded-2xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200">
            </div>

            <div v-else-if="currentQuestion.format_question === 'TEXT'">
              <textarea v-model="currentResponse.Valeur" rows="4" class="w-full p-4 border-2 rounded-2xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200" placeholder="Entrez votre réponse..."></textarea>
            </div>

            <div v-else-if="currentQuestion.format_question === 'DATE'">
              <input type="date" v-model="currentResponse.Valeur" class="w-full p-4 border-2 rounded-2xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200">
            </div>

            <div class="flex gap-4">
              <button @click="openCommentModal" class="action-button" :class="[
                'flex items-center gap-2 px-4 py-2 border rounded-lg',
                currentResponse?.Commentaire
                  ? 'has-content'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              ]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {{ currentResponse?.Commentaire ? 'Modifier le commentaire' : 'Ajouter un commentaire' }}
              </button>
              <button @click="openActionModal" class="action-button" :class="[
                'flex items-center gap-2 px-4 py-2 border rounded-lg',
                currentResponse?.PlanAction
                  ? 'has-content'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              ]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                {{ currentResponse?.PlanAction ? 'Modifier le plan d\'action' : 'Définir un plan d\'action' }}
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>

    <!-- Navigation fixe en bas -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <button @click="previousQuestion" class="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200" :disabled="isFirstVisibleQuestion">
          Question précédente
        </button>
        <button @click="nextQuestion" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200" :disabled="isLastVisibleQuestion">
          Question suivante
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showSummary: false,
      currentPage: null,  // A remplir avec les données appropriées
      currentAudit: null,  // A remplir avec les données appropriées
      currentQuestion: null,  // A remplir avec les données appropriées
      currentResponse: null,  // A remplir avec les données appropriées
      visibleQuestionIndex: 0,
      totalVisibleQuestions: 0, // A remplir selon le nombre total de questions visibles
      transitionName: 'fade',  // Nom de la transition
    };
  },
  computed: {
    pageProgress() {
      return (this.visibleQuestionIndex / this.totalVisibleQuestions) * 100;
    },
    isFirstVisibleQuestion() {
      return this.visibleQuestionIndex === 0;
    },
    isLastVisibleQuestion() {
      return this.visibleQuestionIndex === this.totalVisibleQuestions - 1;
    }
  },
  methods: {
    nextQuestion() {
      if (!this.isLastVisibleQuestion) {
        this.visibleQuestionIndex++;
        this.updateQuestion();
      }
    },
    previousQuestion() {
      if (!this.isFirstVisibleQuestion) {
        this.visibleQuestionIndex--;
        this.updateQuestion();
      }
    },
    updateQuestion() {
      // Mettre à jour la question en fonction de l'index actuel
    },
    updateResponse(value) {
      // Mettre à jour la réponse
    },
    toggleCheckboxResponse(id) {
      // Logique pour activer/désactiver une réponse de type checkbox
    },
    openCommentModal() {
      // Logique pour ouvrir la modal de commentaire
    },
    openActionModal() {
      // Logique pour ouvrir la modal de plan d'action
    },
    isChecked(id) {
      // Vérifier si une réponse de type checkbox est cochée
      return this.currentResponse?.Valeur.includes(id);
    },
    isQuestionVisible(question) {
      // Logique pour vérifier si la question est visible
      return true;  // À personnaliser selon la logique spécifique
    }
  },
  watch: {
    '$route': 'updatePage',  // Mettre à jour la page lorsque la route change
  },
  methods: {
    updatePage() {
      // Logique pour mettre à jour la page
    }
  }
};
</script>

<style scoped>
/* Styles supplémentaires ici */
.option-button {
  padding: 16px;
  text-align: left;
  border-radius: 9999px;
  transition: all 0.2s ease-in-out;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 9999px;
  transition: all 0.2s ease-in-out;
}

.has-content {
  background-color: #f0f9ff;
  border-color: #60a5fa;
  color: #1e3a8a;
}

.has-content:hover {
  background-color: #dbeafe;
  border-color: #2563eb;
}
</style>
