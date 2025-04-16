import React from 'react';
import _ from 'lodash';
import { createRoot } from 'react-dom/client';
import { useReplicant } from '@nodecg/react-hooks';
import classNames from 'classnames';
import { ArrowPathIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import './index.dashboard.css';
import { Players } from '../types/schemas/players';

const Panel = () => {
  const [startGgApiKey, setStartGgApiKey] = useReplicant<string>('startGgApiKey');
  const [startGgEventId, setStartGgEventId] = useReplicant<string>('startGgEventId');
  const [eventName, setEventName] = useReplicant<string>('eventName');
  const [players, setPlayers] = useReplicant<Players>('players');

  const sortPlayers = (a: any, b: any) => {
    const phases: { [key: string]: number } = {
      'Upper Division Swiss': 0,
      'Lower Division': 1,
      'Pool F1': 0,
      'Pool J1': 1,
    };
    
    const [phaseA, phaseB] = [a?.seed?.phase ?? '', b?.seed?.phase ?? ''];
    const [seedA, seedB] = [a?.seed?.seedNum ?? 0, b?.seed?.seedNum ?? 0];
    
    return (phases[phaseA] ?? 2) - (phases[phaseB] ?? 2) || seedA - seedB;
  };

  return (
    <div className="p-4">
      <div className="flex flex-row gap-2">
        <div className={classNames("badge badge-soft", startGgApiKey ? 'badge-success' : 'badge-error')}>
          {startGgApiKey ? 'API Key Set' : 'No API Key Set'}
        </div>
        <div className={classNames("badge badge-soft", startGgEventId ? 'badge-success' : 'badge-error')}>
          {startGgEventId ? 'Event ID Set' : 'No Event ID Set'}
        </div>
        <ArrowPathIcon 
          className={classNames(
            "w-4 h-4 hover:cursor-pointer hover:text-gray-600", 
            startGgApiKey && startGgEventId ? 'text-green-500 hover:text-green-600' : 'text-gray-400'
          )} 
          onClick={() => {
            if (startGgApiKey && startGgEventId) {
              (window as any).nodecg.sendMessage('getPlayers', startGgEventId);
              (window as any).nodecg.sendMessage('getEventName', startGgEventId);
            }
          }} 
        />
        <div nodecg-dialog="stage-up-player-manager-settings">
          <Cog6ToothIcon className="w-4 h-4 hover:cursor-pointer text-gray-400 hover:text-gray-600" />
        </div>
      </div>
      <h1 className="text-4xl font-extrabold my-4">{eventName}</h1>
      <div className="divider" />
      <h1 className="text-2xl font-bold mb-4">Players</h1>
      {players && players.length > 0 && <p>Players: {players.length}</p>}
      <div className="grid grid-cols-3 gap-4">
        {players && players.length > 0 && players
          .filter(player => player?.seed?.seedNum != null)
          .sort(sortPlayers)
          .map((player) => (
            <div key={player.id} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h2 className="card-title flex flex-row items-center gap-2">
                  {player.avatar && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={player.avatar} 
                        alt={`${player.name}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col">
                    {player.prefix && (
                      <span className="text-xs text-gray-500">{player.prefix}</span>
                    )}
                    <span className="truncate">{player.name}</span>
                  </div>
                </h2>
                <p>Seed {player.seed.seedNum}</p>
                <p>{player.seed.phase}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Panel />);
