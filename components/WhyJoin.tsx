import { useState } from 'react';
import { Chips, Chip } from '@mantine/core'; // https://mantine.dev/core/chips/#multiple

const options = ['just curious', 'start a new job in web3', 'launch a web3 business', 'find a role with NEAR'];

export default function WhyJoin({ defaultValue }: { defaultValue: string }) {
  // array of strings value when multiple is true
  const [value, setValue] = useState(defaultValue ? defaultValue.split(',') : undefined);

  return (
    <Chips value={value} onChange={setValue} multiple name="whyJoin">
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
