function Selector({ id, label, selectedValue, options, onChange, 'class': className = '' }) {
  return (
    <>
      <label class="font-bold block text-gray-700" for={id}>{label}</label>
      <select
        id={id}
        onChange={onChange ?? (() => 1)}
        class={"shadow-md border border-solid border-gray-400 bg-white p-1 rounded-md hover:outline hover:outline-2 hover:outline-solid hover:outline-black hover:cursor-pointer " + className}
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
