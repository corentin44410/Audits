import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AuditDB extends DBSchema {
  audits: {
    key: string;
    value: any;
  };
  questionnaires: {
    key: number;
    value: any;
  };
}

const DB_NAME = 'audit-app-db';
const DB_VERSION = 1;

export async function initDB() {
  return await openDB<AuditDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('audits')) {
        db.createObjectStore('audits', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('questionnaires')) {
        db.createObjectStore('questionnaires', { keyPath: 'id' });
      }
    },
  });
}

let db: IDBPDatabase<AuditDB>;

export async function getDB() {
  if (!db) {
    db = await initDB();
  }
  return db;
}

export async function saveAudit(audit: any) {
  const db = await getDB();
  await db.put('audits', audit);
}

export async function getAudit(id: string) {
  const db = await getDB();
  return await db.get('audits', id);
}

export async function getAllAudits() {
  const db = await getDB();
  return await db.getAll('audits');
}

export async function deleteAudit(id: string) {
  const db = await getDB();
  await db.delete('audits', id);
}

export async function saveQuestionnaire(questionnaire: any) {
  const db = await getDB();
  await db.put('questionnaires', questionnaire);
}

export async function getQuestionnaire(id: number) {
  const db = await getDB();
  return await db.get('questionnaires', id);
}