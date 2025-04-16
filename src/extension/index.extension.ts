import NodeCG from 'nodecg/types';
import { createStartGgClient } from './startgg/client';
import getEntrantsFromEvent from './startgg/getEntrantsFromEvent';
import getEventName from './startgg/getEventName';

module.exports = function (nodecg: NodeCG.ServerAPI) {
  const startGgApiKey = nodecg.Replicant('startGgApiKey', { defaultValue: '' });
  const players = nodecg.Replicant('players', { defaultValue: [] });
  const eventName = nodecg.Replicant('eventName', { defaultValue: '' });

  nodecg.listenFor('getPlayers', async (eventId: string) => {
    nodecg.log.info('Getting players for event ID:', eventId);
    const client = createStartGgClient(startGgApiKey.value);
    const entrants = await getEntrantsFromEvent(eventId, client);
    players.value = entrants;
    nodecg.log.info('Players fetched:', players.value);
  });

  nodecg.listenFor('getEventName', async (eventId: string) => {
    nodecg.log.info('Getting event name for event ID:', eventId);
    const client = createStartGgClient(startGgApiKey.value);
    const name = await getEventName(eventId, client);
    eventName.value = name || '';
    nodecg.log.info('Event name fetched:', eventName.value);
  });

  nodecg.log.info('Player manager loaded!');
};
