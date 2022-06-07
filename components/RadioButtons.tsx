/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/label-has-associated-control */

const borderColor = 'hsl(210deg 14% 83%)'; // Must match border-color of Tailwind `label` elements.

export default function RadioButtons({
  name,
  options,
  currentValue,
  onChange,
  required,
}: {
  name: string;
  options: any;
  currentValue: string | null;
  onChange: any;
  required?: boolean;
}): JSX.Element {
  const optionsObj = Array.isArray(options) ? Object.assign({}, ...options.map((val: string) => ({ [val]: val }))) : options;
  console.log({ currentValue });
  return (
    <>
      {Object.keys(optionsObj).map((key) => {
        const checked = key === currentValue;
        return (
          <label key={key} role="button" className="border p-1 m-1 rounded d-block" style={{ borderColor }}>
            <input type="radio" name={name} value={key} checked={checked} onChange={onChange} required={required} /> {optionsObj[key]}
          </label>
        );
      })}
    </>
  );
}

RadioButtons.defaultProps = {
  required: false,
};
