import { useState } from 'react';
import { MultiSelect } from '@mantine/core'; // https://mantine.dev/core/multi-select/#creatable

// This array came from Katya's data.
const frameworksAndPlatforms = [
  'React',
  'Angular',
  'Svelte',
  'Vue',
  'Next.js',
  'Node.js',
  'NestJS',
  'Nuxt',
  'Laravel',
  'Azure',
  'Amazon Web Services (AWS)',
  'Flask',
  'ASP.NET',
  'Terraform',
  'WordPress',
  'Google Cloud Platform (GCP)',
].sort((a, b) => a.localeCompare(b));

export default function FrameworksAndPlatforms({ defaultValue }: { defaultValue: string }) {
  const [data, setData] = useState(frameworksAndPlatforms);

  return (
    <MultiSelect
      data={data}
      defaultValue={defaultValue ? defaultValue.split(',') : undefined}
      name="frameworksAndPlatforms"
      placeholder="Select your favorites"
      searchable
      creatable
      getCreateLabel={(query) => `+ Create new tag: ${query}`}
      onCreate={(query) => setData((current) => [...current, query])}
    />
  );
}
