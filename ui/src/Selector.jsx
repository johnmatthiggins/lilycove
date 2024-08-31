function Selector({ id, label, selectedValue, options, onChange, 'class': className = '' }) {
  return (
    <>
      <label class="font-bold block" for={id}>{label}</label>
      <select
        id={id}
        onChange={onChange ?? (() => 1)}
        class={"border border-solid border-gray-400 bg-white px-1 py-1.5 rounded-sm focus:border-white focus:outline-2 focus:outline-solid focus:outline-emerald-400 " + className}
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
