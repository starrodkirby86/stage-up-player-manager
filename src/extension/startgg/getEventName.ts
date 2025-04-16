import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';

/**
 * GraphQL query to fetch the name of an event by its ID
 */
const GET_EVENT_NAME = gql`
  query EventName($eventId: ID!) {
    event(id: $eventId) {
      name
    }
  }
`;

/**
 * Fetches the name of an event using the Start.gg API
 * @param eventId - The ID of the event to fetch the name from
 * @param client - The Apollo Client instance
 * @returns The name of the event
 */
const getEventName = async (
  eventId: string,
  client: ApolloClient<NormalizedCacheObject>
): Promise<string | null> => {
  try {
    const { data } = await client.query({
      query: GET_EVENT_NAME,
      variables: { eventId },
    });

    return data.event?.name || null;
  } catch (error) {
    console.error('Error fetching event name:', error);
    return null;
  }
};

export default getEventName;
