const SHEET_ID = process.env.GOOGLE_SHEET_ID; // ID de votre feuille
const SHEET_RANGE = 'Tokens!A:A'; // Colonne A de la feuille "Tokens"
const API_KEY = process.env.GOOGLE_API_KEY; // clé API Google

export async function fetchTokens() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error('Erreur récupération tokens:', res.statusText);
    return [];
  }
  const data = await res.json();
  // Flatten et nettoyer les valeurs
  return (data.values || []).map(row => row[0].trim());
}
