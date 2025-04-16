import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

/**
 * Creates an Apollo Client instance configured for the start.gg API
 * @param apiKey - The start.gg API key
 * @returns ApolloClient instance
 */
export function createStartGgClient(apiKey: string) {
  if (!apiKey) {
    throw new Error('start.gg API key is required');
  }

  const link = createHttpLink({
    uri: 'https://api.start.gg/gql/alpha',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });
} 