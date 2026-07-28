export default {
  async fetch(request, env) {
    let response = await env.ASSETS.fetch(request);
    
    // Fallback to index.html for SPA routing
    if (response.status === 404 && !request.url.includes('.')) {
      let indexRequest = new Request(new URL('/', request.url), request);
      response = await env.ASSETS.fetch(indexRequest);
    }
    
    return response;
  }
};
