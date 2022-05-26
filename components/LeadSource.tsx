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

export default function LeadSource({ defaultValue }: { defaultValue: string }) {
  return (
    <Chips defaultValue={defaultValue} name="leadSource">
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
