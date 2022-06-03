import { useState } from 'react';
import { MultiSelect } from '@mantine/core'; // https://mantine.dev/core/multi-select/#creatable

// This array came from Katya's data.
const languages = [
  'JavaScript',
  'Python',
  'Ruby',
  'Rust',
  'Solidity',
  'Substrate',
  'TypeScript',
  'WebAssembly',
  'Acala',
  'AssemblyScript',
  'CSS',
  'HTML',
  'GraphQL',
  'Java',
  'PHP',
  'MATLAB',
  'SQL',
  'C++',
  'C#',
  'C',
].sort((a, b) => a.localeCompare(b));

export default function ProgrammingLanguages({ defaultValue }: { defaultValue: string }) {
  const [data, setData] = useState(languages);

  return (
    <MultiSelect
      data={data}
      defaultValue={defaultValue ? defaultValue.split(',') : undefined}
      name="programmingLanguages"
      placeholder="Select your favorites"
      searchable
      creatable
      required
      getCreateLabel={(query) => `+ Create new tag: ${query}`}
      onCreate={(query) => setData((current) => [...current, query])}
    />
  );
}
