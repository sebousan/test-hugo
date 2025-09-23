// netlify/functions/verify-invite.js
exports.handler = async (event, context) => {
  const { invite_token } = JSON.parse(event.body);
  
  try {
    // Vérifier le token d'invitation auprès de Netlify Identity
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${process.env.NETLIFY_SITE_ID}/identity/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'invite',
        token: invite_token
      })
    });
    
    if (response.ok) {
      const userData = await response.json();
      
      // Générer votre propre session/cookie pour l'accès au site
      const sessionToken = jwt.sign(
        { 
          email: userData.email,
          invited: true,
          exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 jours
        },
        process.env.JWT_SECRET
      );
      
      return {
        statusCode: 200,
        headers: {
          'Set-Cookie': `site-access=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${30*24*60*60}`,
          'Location': '/' // Rediriger vers l'accueil
        },
        body: JSON.stringify({ 
          authorized: true, 
          email: userData.email 
        })
      };
    } else {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Token d\'invitation invalide' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur serveur' })
    };
  }
};