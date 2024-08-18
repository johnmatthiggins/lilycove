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
      <input
        class="w-12 border border-solid border-slate-200 px-1"
        type="number"
        min={min}
        max={max}
        step={step}
        value={state()}
        onInput={handleChange}
      >
      </input>
    </div>
  );
}

export default RangeInput;
