import { SnippedGeneratorPlugin } from 'src/config/swagger/snippet.pluggin';

export const swaggerOptions = {
  swaggerOptions: {
    dom_id: '#swagger-ui',
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    defaultModelsExpandDepth: 4,
    plugins: [SnippedGeneratorPlugin],
    requestSnippetsEnabled: true,
    requestSnippets: {
      generators: {
        node_native: {
          title: 'NodeJs Native',
          syntax: 'javascript',
        },
      },
    },
  },
  explorer: true,
  jsonDocumentUrl: 'api-docs-json',
};
