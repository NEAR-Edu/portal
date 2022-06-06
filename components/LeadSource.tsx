import { Select } from '@mantine/core'; // https://mantine.dev/core/select/#creatable
import { useState } from 'react';

const options = [
  'Twitter',
  'Google',
  'Instagram',
  'near.academy',
  'Email',
  'BitKE',
  'chainEd',
  'crypto capable',
  'Friend / colleague',
  'Guilds or OWS',
  'lumos labs',
  'NEAR Community Forum',
  'NEAR Hispano',
  'near.org',
  'near.university',
  'Referral Program',
  'Sankore',
  'Someone working in NEAR',
  'stats.gallery',
  'Telegram',
  'unschool',
  'YouTube',
]; // .sort((a, b) => a.localeCompare(b));

export const referralProgram = 'Referral Program'; // This must exist within `options` defined above. It triggers the referralMainnetAccount question to be displayed.
export const referralOptions = ['Friend / colleague', 'Guilds or OWS', 'Someone working in NEAR']; // This array must be a subset of `options` defined above. It triggers the "Who referred you?" question.

export default function LeadSource({ defaultValue }: { defaultValue: string }) {
  const [data, setData] = useState(options);
  const field = 'leadSource';
  return (
    <Select
      data={data}
      placeholder="How did you hear about this course?"
      searchable
      creatable
      name={field}
      defaultValue={defaultValue}
      getCreateLabel={(query) => `"${query}"`}
      onCreate={(query) => setData((current) => [...current, query])}
    />
  );
}
