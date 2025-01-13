<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header fixe -->
    <div class="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <router-link :to="`/audit/${route.params.id}`" class="text-blue-500 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </router-link>
          <h1 class="text-lg font-medium">{{ currentPage?.titre_page }}</h1>
        </div>
        
        <button
          @click="showSummary = !showSummary"
          class="flex items-center px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <span class="mr-2">{{ showSummary ? 'Continuer l\'audit' : 'Voir le récapitulatif' }}</span>
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="showSummary"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Contenu principal avec padding-top pour éviter le header -->
    <div class="pt-20">
      <div v-if="showSummary" class="max-w-4xl mx-auto">
        <AuditSummary :responses="currentAudit?.responses || []" :audit-id="route.params.id as string" />
      </div>

      <div v-else class="max-w-3xl mx-auto">
        <div class="mb-8">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              :style="{ width: `${pageProgress}%` }"
            ></div>
          </div>
          <p class="text-sm text-gray-600 mt-1">Question {{ visibleQuestionIndex + 1 }} sur {{ totalVisibleQuestions }}</p>
        </div>

        <TransitionGroup
          :name="transitionName"
          mode="out-in"
          class="relative"
        >
          <div
            v-if="currentQuestion && isQuestionVisible(currentQuestion)"
            :key="currentQuestion.id_question"
            class="space-y-6"
          >
            <div>
              <h2 class="text-xl font-semibold mb-2">{{ currentQuestion.libelle_question }}</h2>
              <p v-if="currentQuestion.bulle_aide" class="text-gray-600">
                {{ currentQuestion.bulle_aide }}
              </p>
            </div>

            <div v-if="currentQuestion.format_question === 'RADIO'" class="grid gap-4">
              <button
                v-for="reponse in currentQuestion.reponses"
                :key="reponse.id_reponse"
                @click="updateResponse(reponse.valeur)"
                class="option-button"
                :class="[
                  'p-4 text-left rounded-2xl transition-all duration-200 border-2',
                  currentResponse?.Valeur === reponse.valeur
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                ]"
              >
                {{ reponse.libelle_reponse }}
              </button>
            </div>

            <div v-else-if="currentQuestion.format_question === 'CHECKBOX'" class="grid gap-4">
              <button
                v-for="reponse in currentQuestion.reponses"
                :key="reponse.id_reponse"
                @click="toggleCheckboxResponse(reponse.id_reponse)"
                class="option-button"
                :class="[
                  'p-4 text-left rounded-2xl transition-all duration-200 border-2',
                  isChecked(reponse.id_reponse)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                ]"
              >
                {{ reponse.libelle_reponse }}
              </button>
            </div>

            <div v-else-if="currentQuestion.format_question === 'TIME'">
              <input
                type="time"
                v-model="currentResponse.Valeur"
                class="w-full p-4 border-2 rounded-2xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
              >
            </div>

            <div v-else-if="currentQuestion.format_question === 'TEXT'">
              <textarea
                v-model="currentResponse.Valeur"
                rows="4"
                class="w-full p-4 border-2 rounded-2xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
                placeholder="Entrez votre réponse..."
              ></textarea>
            </div>

            <div v-else-if="currentQuestion.format_question === 'DATE'">
              <input
                type="date"
                v-model="currentResponse.Valeur"
                class="w-full p-4 border-2 rounded-2xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
              >
            </div>

            <div class="flex gap-4">
              <button
                @click="openCommentModal"
                class="action-button"
                :class="[
                  'flex items-center gap-2 px-4 py-2 border rounded-lg',
                  currentResponse?.Commentaire
                    ? 'has-content'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {{ currentResponse?.Commentaire ? 'Modifier le commentaire' : 'Ajouter un commentaire' }}
              </button>
              <button
                @click="openActionModal"
                class="action-button"
                :class="[
                  'flex items-center gap-2 px-4 py-2 border rounded-lg',
                  currentResponse?.PlanAction
                    ? 'has-content'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                ]"
              >
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
        <button
          @click="previousQuestion"
          class="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          :disabled="isFirstVisibleQuestion"
        >
          Question précédente
        </button>
        <button
          @click="nextQuestion"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canProceed"
        >
          {{ isLastVisibleQuestion ? 'Terminer' : 'Question suivante' }}
        </button>
      </div>
    </div>

    <!-- Modals -->
    <Transition name="modal">
      <div v-if="showCommentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg w-full max-w-lg">
          <h2 class="text-xl font-bold mb-4">Ajouter un commentaire</h2>
          <textarea
            v-model="commentText"
            rows="4"
            class="w-full p-4 border-2 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200 mb-4"
            placeholder="Saisissez votre commentaire..."
          ></textarea>
          <div class="flex justify-end gap-4">
            <button
              @click="showCommentModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              @click="saveComment"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="showActionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg w-full max-w-lg">
          <h2 class="text-xl font-bold mb-4">Définir un plan d'action</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                v-model="actionPlan.description"
                rows="3"
                class="w-full p-4 border-2 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
                placeholder="Décrivez l'action à mener..."
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Date d'échéance
              </label>
              <input
                type="date"
                v-model="actionPlan.dueDate"
                class="w-full p-4 border-2 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
              >
            </div>
          </div>
          <div class="flex justify-end gap-4 mt-6">
            <button
              @click="showActionModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              @click="saveAction"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuditStore } from '../stores/audit';
import questionnaire from '../data/questionnaire.json';
import AuditSummary from '../components/AuditSummary.vue';
import type { UtilisateurReponse, Question } from '../types/questionnaire';

const route = useRoute();
const router = useRouter();
const auditStore = useAuditStore();

const currentPageIndex = ref(0);
const currentQuestionIndex = ref(0);
const showSummary = ref(false);
const showCommentModal = ref(false);
const showActionModal = ref(false);
const commentText = ref('');
const actionPlan = ref({
  description: '',
  dueDate: ''
});
const isTransitioning = ref(false);
const transitionName = ref('slide-left');

const currentAudit = computed(() => {
  return auditStore.audits.find(a => a.id === route.params.id);
});

const currentPage = computed(() => questionnaire.pages[currentPageIndex.value]);
const currentQuestion = computed(() => currentPage.value?.questions[currentQuestionIndex.value]);

const currentResponse = ref<UtilisateurReponse>({
  QuestionnaireId: questionnaire.id,
  PageId: 0,
  ReponseId: 0,
  QuestionId: 0,
  AuditId: route.params.id as string,
  Valeur: null,
  Commentaire: '',
  PlanAction: null,
  BloqueEnContreVisite: 0,
  DateMaj: new Date().toISOString(),
  ID: 0,
  GUID: crypto.randomUUID(),
  LastUpdateDate: new Date().toISOString()
});

const isQuestionVisible = (question: Question): boolean => {
  try {
    if (!question.attribut) return true;
    
    const attributes = JSON.parse(question.attribut);
    if (!attributes.attributs.display) return true;
    
    const conditions = JSON.parse(attributes.attributs.display);
    
    if (!conditions || !Array.isArray(conditions)) return true;
    
    return conditions.some(conditionGroup => {
      return conditionGroup.every(condition => isConditionMet(condition));
    });
  } catch (e) {
    console.error('Error parsing question attributes:', e);
    return true;
  }
};

const isConditionMet = (condition: {question: string, reponse: string}): boolean => {
  const response = currentAudit.value?.responses.find(
    r => r.QuestionId === parseInt(condition.question)
  );
  if (!response) return false;
  
  const question = questionnaire.pages
    .flatMap(p => p.questions)
    .find(q => q.id_question === parseInt(condition.question));
    
  if (!question) return false;

  if (question.format_question === 'RADIO') {
    const selectedResponse = question.reponses.find(r => r.valeur === response.Valeur);
    return selectedResponse?.id_reponse.toString() === condition.reponse;
  }
  
  if (question.format_question === 'CHECKBOX' && Array.isArray(response.Valeur)) {
    return response.Valeur.includes(parseInt(condition.reponse));
  }
  
  return false;
};

const visibleQuestions = computed(() => {
  if (!currentPage.value) return [];
  return currentPage.value.questions.filter(q => isQuestionVisible(q));
});

const totalVisibleQuestions = computed(() => visibleQuestions.value.length);

const visibleQuestionIndex = computed(() => {
  return visibleQuestions.value.findIndex(q => q.id_question === currentQuestion.value?.id_question);
});

const isFirstVisibleQuestion = computed(() => visibleQuestionIndex.value === 0);
const isLastVisibleQuestion = computed(() => visibleQuestionIndex.value === visibleQuestions.value.length - 1);

const pageProgress = computed(() => {
  if (!currentPage.value || totalVisibleQuestions.value === 0) return 0;
  return ((visibleQuestionIndex.value + 1) / totalVisibleQuestions.value) * 100;
});

const canProceed = computed(() => {
  if (!currentQuestion.value?.obligatoire) return true;
  if (currentQuestion.value.format_question === 'CHECKBOX') {
    return Array.isArray(currentResponse.value.Valeur) && currentResponse.value.Valeur.length > 0;
  }
  return currentResponse.value.Valeur !== null && currentResponse.value.Valeur !== '';
});

watch(currentQuestion, () => {
  if (!currentQuestion.value) return;

  const savedResponse = currentAudit.value?.responses.find(
    r => r.QuestionId === currentQuestion.value?.id_question
  );

  if (savedResponse) {
    currentResponse.value = { ...savedResponse };
    commentText.value = savedResponse.Commentaire || '';
    if (savedResponse.PlanAction) {
      try {
        const planAction = JSON.parse(savedResponse.PlanAction);
        actionPlan.value = {
          description: planAction.Description || '',
          dueDate: planAction.Echeance || ''
        };
      } catch (e) {
        console.error('Error parsing plan action:', e);
      }
    }
  } else {
    currentResponse.value = {
      QuestionnaireId: questionnaire.id,
      PageId: currentPage.value?.id_page || 0,
      ReponseId: 0,
      QuestionId: currentQuestion.value.id_question,
      AuditId: route.params.id as string,
      Valeur: null,
      Commentaire: '',
      PlanAction: null,
      BloqueEnContreVisite: 0,
      DateMaj: new Date().toISOString(),
      ID: 0,
      GUID: crypto.randomUUID(),
      LastUpdateDate: new Date().toISOString()
    };
    commentText.value = '';
    actionPlan.value = { description: '', dueDate: '' };
  }
});

onMounted(() => {
  const savedPageIndex = localStorage.getItem('currentPageIndex');
  const savedQuestionIndex = localStorage.getItem('currentQuestionIndex');
  
  if (savedPageIndex && savedQuestionIndex) {
    currentPageIndex.value = parseInt(savedPageIndex);
    currentQuestionIndex.value = parseInt(savedQuestionIndex);
    
    localStorage.removeItem('currentPageIndex');
    localStorage.removeItem('currentQuestionIndex');
  }
});

const updateResponse = (value: any) => {
  currentResponse.value.Valeur = value;
  currentResponse.value.LastUpdateDate = new Date().toISOString();
  saveResponse();
};

const toggleCheckboxResponse = (id: number) => {
  if (!Array.isArray(currentResponse.value.Valeur)) {
    currentResponse.value.Valeur = [];
  }
  const index = currentResponse.value.Valeur.indexOf(id);
  if (index === -1) {
    currentResponse.value.Valeur.push(id);
  } else {
    currentResponse.value.Valeur.splice(index, 1);
  }
  currentResponse.value.LastUpdateDate = new Date().toISOString();
  saveResponse();
};

const isChecked = (id: number) => {
  return Array.isArray(currentResponse.value.Valeur) && currentResponse.value.Valeur.includes(id);
};

const saveResponse = () => {
  if (currentQuestion.value) {
    auditStore.updateAuditResponse(
      route.params.id as string,
      currentQuestion.value.id_question,
      currentResponse.value
    );
  }
};

const nextQuestion = () => {
  isTransitioning.value = true;
  saveResponse();
  transitionName.value = 'slide-left';
  
  const currentVisibleQuestions = visibleQuestions.value;
  const currentIndex = visibleQuestionIndex.value;
  
  if (currentIndex < currentVisibleQuestions.length - 1) {
    const nextQuestion = currentVisibleQuestions[currentIndex + 1];
    currentQuestionIndex.value = currentPage.value.questions.findIndex(
      q => q.id_question === nextQuestion.id_question
    );
  } else if (currentPageIndex.value < questionnaire.pages.length - 1) {
    currentPageIndex.value++;
    currentQuestionIndex.value = 0;
  } else {
    router.push('/');
  }
  
  setTimeout(() => {
    isTransitioning.value = false;
  }, 300);
};

const previousQuestion = () => {
  isTransitioning.value = true;
  transitionName.value = 'slide-right';
  
  const currentVisibleQuestions = visibleQuestions.value;
  const currentIndex = visibleQuestionIndex.value;
  
  if (currentIndex > 0) {
    const prevQuestion = currentVisibleQuestions[currentIndex - 1];
    currentQuestionIndex.value = currentPage.value.questions.findIndex(
      q => q.id_question === prevQuestion.id_question
    );
  } else if (currentPageIndex.value > 0) {
    currentPageIndex.value--;
    const prevPage = questionnaire.pages[currentPageIndex.value];
    const prevVisibleQuestions = prevPage.questions.filter(q => isQuestionVisible(q));
    currentQuestionIndex.value = prevPage.questions.findIndex(
      q => q.id_question === prevVisibleQuestions[prevVisibleQuestions.length - 1].id_question
    );
  }
  
  setTimeout(() => {
    isTransitioning.value = false;
  }, 300);
};

const openCommentModal = () => {
  showCommentModal.value = true;
};

const saveComment = () => {
  currentResponse.value.Commentaire = commentText.value;
  currentResponse.value.LastUpdateDate = new Date().toISOString();
  showCommentModal.value = false;
  saveResponse();
};

const openActionModal = () => {
  showActionModal.value = true;
};

const saveAction = () => {
  currentResponse.value.PlanAction = JSON.stringify({
    Description: actionPlan.value.description,
    Echeance: actionPlan.value.dueDate
  });
  currentResponse.value.LastUpdateDate = new Date().toISOString();
  showActionModal.value = false;
  saveResponse();
};
</script>

<style scoped>
/* Ajustement pour le contenu fixe */
.container {
  max-width: 100%;
  margin: 0 auto;
  padding-bottom: 80px; /* Pour éviter que le contenu ne soit caché par la barre de navigation */
}

/* Animations des transitions */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-in-out;
  position: absolute;
  width: 100%;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Animation des modales */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Style des boutons d'action */
.action-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.action-button::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: -100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.action-button:hover::after {
  left: 100%;
}

.action-button.has-content {
  @apply bg-blue-50 border-blue-200 text-blue-600;
}
</style>
```