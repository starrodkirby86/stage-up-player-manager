import React from 'react';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { createRoot } from 'react-dom/client';
import { useReplicant, useListenFor } from '@nodecg/react-hooks';
import './index.dashboard.css';

type SettingsFormInput = {
  apiKey: string;
  eventId: string;
};


const Settings = () => {
  const [startGgApiKey, setStartGgApiKey] = useReplicant<string>('startGgApiKey');
  const [startGgEventId, setStartGgEventId] = useReplicant<string>('startGgEventId');
  const { register, handleSubmit, formState: { isSubmitSuccessful } } = useForm<SettingsFormInput>({
    defaultValues: {
      apiKey: startGgApiKey,
      eventId: startGgEventId
    }
  });

  const onSubmit = (data: SettingsFormInput) => {
    console.log(data);
    setStartGgApiKey(data.apiKey);
    setStartGgEventId(data.eventId);
  };

  return (
    <div className="p-4">
      {
        isSubmitSuccessful && (
          <div className="alert alert-success">
            <span>Settings saved successfully!</span>
          </div>
        )
      }
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">start.gg API Key</span>
          </label>
          <input
            type="text"
            {...register("apiKey")}
            className="input input-bordered w-full"
            placeholder='Enter your start.gg API key'
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">start.gg Event ID</span>
          </label>
          <input
            type="text"
            {...register("eventId")}
            className="input input-bordered w-full"
            placeholder='Enter your start.gg event ID'
          />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Settings />);
