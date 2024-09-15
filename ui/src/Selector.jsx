function Selector({ id, label, selectedValue, options, onChange, 'class': className = '' }) {
  return (
    <>
      <label class="font-bold block text-gray-700" for={id}>{label}</label>
      <select
        id={id}
        onChange={onChange ?? (() => 1)}
        class={"border border-solid border-gray-400 bg-white px-2 py-1 rounded-md " + className}
      >
        <For each={options()}>
          {({ value, label }) => (
            <option
              value={value}
              selected={value === selectedValue() ? "selected" : undefined}
            >
              {label}
            </option>
          )}
        </For>
      </select >
    </>
  );
}

export default Selector;
