import { useState } from 'react';
import { MultiSelect } from '@mantine/core'; // https://mantine.dev/core/multi-select/#creatable

const technicalStrengths = ['React', 'Angular', 'Svelte', 'Vue']; // TODO get from Katya. Maybe sort alphabetically?

export default function TechnicalStrengths({ defaultValue }: { defaultValue: string }) {
  const [data, setData] = useState(technicalStrengths);

  return (
    <MultiSelect
      data={data}
      defaultValue={defaultValue ? defaultValue.split(',') : undefined}
      name="technicalStrengths"
      placeholder="Select your technical strengths"
      searchable
      creatable
      getCreateLabel={(query) => `+ Create new tag: ${query}`}
      onCreate={(query) => setData((current) => [...current, query])}
    />
  );
}
