import { createSignal } from 'solid-js';

function RangeInput({
  onChange,
  step,
  min,
  max,
  value,
  slider = true,
  'class': className = "",
}) {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };
  const isOutOfBounds = () => {
    if (max && min) {
      return Number(value()) > Number(max) || Number(value()) < Number(min);
    } else if (max) {
      return Number(value()) > Number(max);
    } else if (min) {
      return Number(value()) < Number(min);
    } else {
      return false;
    }
  };
  return (
    <div class={"flex gap-2 " + className}>
      <Show when={slider}>
        <input
          type="range"
          step={step}
          min={min}
          max={max}
          value={value()}
          onInput={handleChange}
        />
      </Show>
      <input
        class="w-12 border border-solid border-gray-400 px-1 rounded-md hover:outline hover:outline-2 hover:outline-solid hover:outline-black"
        type="number"
        min={min}
        max={max}
        step={step}
        value={value()}
        onInput={handleChange}
        style={{ color: isOutOfBounds() ? 'red' : undefined }}
      >
      </input>
    </div>
  );
}

export default RangeInput;
