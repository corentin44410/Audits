import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Audit, UtilisateurReponse } from '../types/questionnaire';
import questionnaire from '../data/questionnaire.json';
import { saveAudit, getAllAudits, deleteAudit as deleteAuditFromDB } from './db';

export const useAuditStore = defineStore('audit', () => {
  const audits = ref<Audit[]>([]);

  const loadAudits = async () => {
    try {
      const savedAudits = await getAllAudits();
      audits.value = savedAudits || [];
    } catch (error) {
      console.error('Erreur lors du chargement des audits:', error);
      audits.value = [];
    }
  };

  const createAudit = async (name: string) => {
    const newAudit: Audit = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      name,
      completion: 0,
      responses: [],
      status: 'draft'
    };
    
    try {
      // Créer une copie sérialisable de l'audit
      const auditForStorage = JSON.parse(JSON.stringify(newAudit));
      await saveAudit(auditForStorage);
      audits.value.push(newAudit);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'audit:', error);
    }
    
    return newAudit.id;
  };

  const updateAuditResponse = async (auditId: string, questionId: number, response: UtilisateurReponse) => {
    const audit = audits.value.find(a => a.id === auditId);
    if (!audit) return;

    const existingResponseIndex = audit.responses.findIndex(r => r.QuestionId === questionId);
    
    if (existingResponseIndex === -1) {
      audit.responses.push(response);
    } else {
      audit.responses[existingResponseIndex] = response;
    }

    const totalQuestions = questionnaire.pages.reduce(
      (total, page) => total + page.questions.length, 
      0
    );
    audit.completion = Math.round((audit.responses.length / totalQuestions) * 100);

    try {
      // Créer une copie sérialisable de l'audit
      const auditForStorage = JSON.parse(JSON.stringify(audit));
      await saveAudit(auditForStorage);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'audit:', error);
    }
  };

  const updateAuditSignature = async (auditId: string, signature: string) => {
    const audit = audits.value.find(a => a.id === auditId);
    if (audit) {
      audit.signature = signature;
      try {
        // Créer une copie sérialisable de l'audit
        const auditForStorage = JSON.parse(JSON.stringify(audit));
        await saveAudit(auditForStorage);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la signature:', error);
      }
    }
  };

  const deleteAudit = async (auditId: string) => {
    const index = audits.value.findIndex(a => a.id === auditId);
    if (index !== -1) {
      audits.value.splice(index, 1);
      try {
        await deleteAuditFromDB(auditId);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'audit:', error);
      }
    }
  };

  const publishAudit = async (auditId: string) => {
    const audit = audits.value.find(a => a.id === auditId);
    if (audit && audit.completion === 100) {
      audit.status = 'published';
      audit.publishedAt = new Date().toISOString();
      try {
        // Créer une copie sérialisable de l'audit
        const auditForStorage = JSON.parse(JSON.stringify(audit));
        await saveAudit(auditForStorage);
      } catch (error) {
        console.error('Erreur lors de la publication de l\'audit:', error);
      }
    }
  };

  return {
    audits,
    loadAudits,
    createAudit,
    updateAuditResponse,
    updateAuditSignature,
    deleteAudit,
    publishAudit
  };
});