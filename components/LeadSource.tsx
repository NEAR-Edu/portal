import { Chips, Chip } from '@mantine/core'; // https://mantine.dev/core/chips/#usage

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
];

export const referralProgram = 'Referral Program'; // This must exist within `options` defined above. It triggers the referralMainnetAccount question to be displayed.
export const referralOptions = ['Friend / colleague', 'Guilds or OWS', 'Someone working in NEAR']; // This array must be a subset of `options` defined above. It triggers the "Who referred you?" question.

export default function LeadSource({ defaultValue, onChange }: { defaultValue: string; onChange: any }) {
  const field = 'leadSource';
  return (
    <Chips
      defaultValue={defaultValue}
      name={field}
      onChange={(val) => {
        onChange(field, val);
      }}
    >
      {options.map((option) => {
        return (
          <Chip value={option} key={option}>
            {option}
          </Chip>
        );
      })}
    </Chips>
  );
}
