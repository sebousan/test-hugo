const SHEET_ID = Deno.env.get("GOOGLE_SHEET_ID");
const SHEET_RANGE = "Tokens!A:A";
const API_KEY = Deno.env.get("GOOGLE_API_KEY");

export async function fetchTokens() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error("Erreur récupération tokens:", res.status, res.statusText);
    return [];
  }

  const data = await res.json();
  return (data.values || []).map(row => row[0].trim());
}