<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold mb-6">Récapitulatif de l'audit</h2>
    
    <div class="space-y-8">
      <div v-for="page in questionnaire.pages" :key="page.id_page" class="border-b pb-6 last:border-b-0">
        <h3 class="text-xl font-semibold mb-4">{{ page.titre_page }}</h3>
        
        <div class="space-y-6">
          <div
            v-for="question in page.questions"
            :key="question.id_question"
            class="bg-gray-50 rounded-lg p-4"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <p class="font-medium text-gray-800">{{ question.libelle_question }}</p>
                  <div v-if="question.attribut" class="flex gap-2 ml-4">
                    <template v-for="etiquette in parseAttributs(question.attribut).attributs.etiquettes" :key="etiquette.texte">
                      <span 
                        class="px-2 py-1 rounded text-xs font-medium"
                        :style="{ backgroundColor: etiquette.couleur + '40', color: etiquette.couleur }"
                      >
                        {{ etiquette.texte }}
                      </span>
                    </template>
                  </div>
                </div>
              </div>
              <button
                @click="editQuestion(page.id_page, question.id_question)"
                class="ml-4 p-2 text-blue-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                title="Modifier la réponse"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            
            <!-- Radio response -->
            <div v-if="question.format_question === 'RADIO'" class="ml-4 text-gray-600">
              {{ getRadioResponse(question) }}
            </div>
            
            <!-- Checkbox response -->
            <div v-else-if="question.format_question === 'CHECKBOX'" class="ml-4">
              <ul v-if="getCheckboxResponses(question).length" class="list-disc list-inside text-gray-600">
                <li v-for="response in getCheckboxResponses(question)" :key="response">
                  {{ response }}
                </li>
              </ul>
              <p v-else class="text-gray-500 italic">Aucune réponse sélectionnée</p>
            </div>
            
            <!-- Date response -->
            <div v-else-if="question.format_question === 'DATE'" class="ml-4 text-gray-600">
              {{ formatDate(getResponse(question.id_question)?.Valeur) }}
            </div>

            <!-- Time response -->
            <div v-else-if="question.format_question === 'TIME'" class="ml-4 text-gray-600">
              {{ getResponse(question.id_question)?.Valeur }}
            </div>

            <!-- Text response -->
            <div v-else-if="question.format_question === 'TEXT'" class="ml-4 text-gray-600">
              {{ getResponse(question.id_question)?.Valeur }}
            </div>
            
            <!-- No response -->
            <p v-if="!getResponse(question.id_question)" class="ml-4 text-gray-500 italic">
              Pas encore répondu
            </p>

            <!-- Commentaire -->
            <div v-if="getResponse(question.id_question)?.Commentaire" class="mt-4 ml-4">
              <p class="text-sm font-medium text-gray-700">Commentaire :</p>
              <p class="text-gray-600">{{ getResponse(question.id_question)?.Commentaire }}</p>
            </div>

            <!-- Plan d'action -->
            <div v-if="getResponse(question.id_question)?.PlanAction" class="mt-4 ml-4">
              <p class="text-sm font-medium text-gray-700">Plan d'action :</p>
              <p class="text-gray-600">{{ getPlanAction(question.id_question)?.Description }}</p>
              <p class="text-sm text-gray-500">
                Échéance : {{ formatDate(getPlanAction(question.id_question)?.Echeance) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useRouter } from 'vue-router';
import questionnaire from '../data/questionnaire.json';
import type { Question, UtilisateurReponse, QuestionAttributes } from '../types/questionnaire';

const props = defineProps<{
  responses: UtilisateurReponse[];
  auditId: string;
}>();

const router = useRouter();

const getResponse = (questionId: number) => {
  return props.responses.find(r => r.QuestionId === questionId);
};

const getRadioResponse = (question: Question) => {
  const response = getResponse(question.id_question);
  if (!response) return null;
  
  const selectedOption = question.reponses.find(r => r.valeur === response.Valeur);
  return selectedOption?.libelle_reponse || 'Réponse invalide';
};

const getCheckboxResponses = (question: Question) => {
  const response = getResponse(question.id_question);
  if (!response || !Array.isArray(response.Valeur)) return [];
  
  return question.reponses
    .filter(r => response.Valeur.includes(r.id_reponse))
    .map(r => r.libelle_reponse)
    .filter(Boolean);
};

const formatDate = (date: string | null | undefined) => {
  if (!date) return null;
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
};

const parseAttributs = (attributJson: string): QuestionAttributes => {
  try {
    return JSON.parse(attributJson);
  } catch (e) {
    console.error('Error parsing attributs:', e);
    return { attributs: { etiquettes: [] } };
  }
};

const getPlanAction = (questionId: number) => {
  const response = getResponse(questionId);
  if (!response?.PlanAction) return null;
  try {
    return JSON.parse(response.PlanAction);
  } catch (e) {
    console.error('Error parsing plan action:', e);
    return null;
  }
};

const editQuestion = (pageId: number, questionId: number) => {
  // Trouver l'index de la page et de la question
  const pageIndex = questionnaire.pages.findIndex(p => p.id_page === pageId);
  const questionIndex = questionnaire.pages[pageIndex].questions.findIndex(q => q.id_question === questionId);
  
  // Stocker les index dans le localStorage pour les récupérer dans AuditView
  localStorage.setItem('currentPageIndex', pageIndex.toString());
  localStorage.setItem('currentQuestionIndex', questionIndex.toString());
  
  // Rediriger vers la vue d'édition
  router.push(`/audit/${props.auditId}/questions`);
};
</script>