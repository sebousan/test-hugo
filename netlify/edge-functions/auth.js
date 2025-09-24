import { fetchTokens } from './fetchTokens.js';

export default async function handler(request, context) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  // Récupération des tokens autorisés
  const allowedTokens = await fetchTokens();

  if (!token || !allowedTokens.includes(token)) {
    return new Response('Accès refusé', { status: 403 });
  }

  // Token valide → continuer vers le site
  return context.next();
}
