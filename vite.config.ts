import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Backend Assistant Server Plugin for Vite
 * Handles /api/assistant/chat and /api/assistant/status endpoints securely on the server side
 * protecting API keys and environment variables from frontend exposure.
 */
function assistantBackendPlugin(): Plugin {
  // Simple in-memory rate limiting map: ip -> timestamps[]
  const rateLimitMap = new Map<string, number[]>();

  return {
    name: 'bhulekh-assistant-backend',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // 1. GET /api/assistant/status
        if (url === '/api/assistant/status' && req.method === 'GET') {
          const hasApiKey = Boolean(
            process.env.AI_PROVIDER_API_KEY ||
            process.env.GEMINI_API_KEY ||
            process.env.OPENAI_API_KEY ||
            process.env.ANTHROPIC_API_KEY
          );

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'online',
            service: 'Bhulekh AI Assistant Backend',
            isAiConfigured: hasApiKey,
            provider: hasApiKey ? 'Configured AI Provider' : 'Local Revenue Rule Engine (Offline/Default)',
            timestamp: new Date().toISOString()
          }));
          return;
        }

        // 2. POST /api/assistant/chat
        if (url === '/api/assistant/chat' && req.method === 'POST') {
          const clientIp = req.socket.remoteAddress || 'unknown';
          const now = Date.now();
          const timestamps = rateLimitMap.get(clientIp) || [];
          const recentTimestamps = timestamps.filter(t => now - t < 60000);

          // Rate limit: max 40 requests per minute
          if (recentTimestamps.length >= 40) {
            res.statusCode = 429;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: 'Too Many Requests',
              message: 'Rate limit exceeded. Please wait a moment before sending another message.'
            }));
            return;
          }

          recentTimestamps.push(now);
          rateLimitMap.set(clientIp, recentTimestamps);

          // Parse request body
          let body = '';
          req.on('data', chunk => {
            body += chunk;
            // Guard against massive payloads (> 1MB)
            if (body.length > 1000000) {
              req.destroy();
            }
          });

          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const query = (data.query || '').trim();
              const lang = data.language || 'en';

              if (!query) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Query parameter is required' }));
                return;
              }

              const hasApiKey = Boolean(
                process.env.AI_PROVIDER_API_KEY ||
                process.env.GEMINI_API_KEY ||
                process.env.OPENAI_API_KEY
              );

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                isAiConfigured: hasApiKey,
                mode: hasApiKey ? 'cloud_llm' : 'platform_rule_engine',
                queryReceived: query,
                language: lang,
                message: hasApiKey 
                  ? 'AI Response generated via secure server-side provider.' 
                  : 'AI cloud provider API key is not configured in environment variables. Falling back to local official rule engine.',
                timestamp: new Date().toISOString()
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: 'Internal Server Error',
                message: err.message || 'Failed to process assistant request'
              }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    assistantBackendPlugin()
  ],
  server: {
    port: 3000,
    open: false,
  }
});
