import { ApolloClient, NormalizedCacheObject, gql } from '@apollo/client';

const GET_ENTRANTS_FROM_EVENT = gql`
  query EventEntrants($eventId: ID!, $page: Int!, $perPage: Int!) {
    event(id: $eventId) {
      id
      name
      entrants(query: { page: $page, perPage: $perPage }) {
        pageInfo {
          total
          totalPages
        }
        nodes {
          id
          name
          seeds {
            phase {
              id
              name
            }
            seedNum
          }
          participants {
            id
            gamerTag
            prefix
            user {
              images {
                url
              }
            }
          }
        }
      }
    }
  }
`;

type SimplifiedEntrant = {
  id: number;
  name: string;
  prefix: string;
  avatar?: string;
  seed: {
    seedNum: number;
    phase: string;
  }
};

const simplifyEntrant = (entrant: any): SimplifiedEntrant => {
  return {
    id: entrant.id,
    name: entrant.participants?.[0]?.gamerTag || entrant.name,
    prefix: entrant.participants?.[0]?.prefix,
    avatar: entrant.participants?.[0]?.user?.images?.[0]?.url,
    seed: {
      seedNum: entrant.seeds?.[0]?.seedNum,
      phase: entrant.seeds?.[0]?.phase?.name
    }
  };
};
/**
 * Fetches entrants from an event using the Start.gg API
 * @param eventId - The ID of the event to fetch entrants from
 * @param client - The Apollo Client instance
 * @returns An array of simplified entrant objects
 */
const getEntrantsFromEvent = async (
  eventId: string,
  client: ApolloClient<NormalizedCacheObject>
) => {
  try {
    const { data } = await client.query({
      query: GET_ENTRANTS_FROM_EVENT,
      variables: { eventId, page: 1, perPage: 100 },
    });
    
    return data.event.entrants.nodes.map(simplifyEntrant);

  } catch (error) {
    console.error('Error fetching entrants from event:', error);
    return [];
  }
};

export default getEntrantsFromEvent;
