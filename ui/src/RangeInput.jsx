import { createSignal } from 'solid-js';

function RangeInput({ onChange, step, min, max, value }) {
  const [state, setState] = createSignal(value);
  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
    setState(event.target.value);
  };
  return (
    <div class="flex gap-2">
      <input
        type="range"
        step={step}
        min={min}
        max={max}
        value={state()}
        onInput={handleChange}
      />
      <p class="w-8">
        {state}
      </p>
    </div>
  );
}

export default RangeInput;
