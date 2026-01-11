import * as admin from 'firebase-admin';

admin.initializeApp({ /* Paste service account JSON */ });

const db = admin.firestore();

async function seed() {
  // Add test company
  const companyRef = await db.collection('companies').add({
    name: 'Test Millwork Co',
    admins: ['test-uid'],
    customPhases: [],
  });
  console.log('Company ID:', companyRef.id);
}

seed();