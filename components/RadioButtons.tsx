/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/label-has-associated-control */

export default function RadioButtons({ name, options, currentValue, onChange }: any): JSX.Element {
  const optionsObj = Array.isArray(options) ? Object.assign({}, ...options.map((val: string) => ({ [val]: val }))) : options;
  console.log({ currentValue });
  return (
    <>
      {Object.keys(optionsObj).map((key) => {
        const checked = key === currentValue;
        return (
          <label key={key} role="button" className="border border-secondary p-1 m-1 rounded d-block">
            <input type="radio" name={name} value={key} checked={checked} onChange={onChange} /> {optionsObj[key]}
          </label>
        );
      })}
    </>
  );
}
