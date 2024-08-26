import RangeInput from './RangeInput';

function EvEditor({ evArray, setEvArray }) {
  const evSum = () => evArray().reduce((a, b) => a + b);
  const setEv = (index, newValue) => setEvArray(evArray().with(index, newValue));
  return (
    <>
      <h3 class="text-2xl font-bold">EVs</h3>
      <label for="hp-ev-slider" class="block font-bold">HP</label>
      <RangeInput
        step="4"
        min="0"
        max="252"
        value={evArray()[0]}
        onChange={(event) => setEv(0, Number(event.target.value))}
      />

      <label for="attack-ev-slider" class="block font-bold">Attack</label>
      <RangeInput
        step="4"
        min="0"
        max="252"
        value={evArray()[1]}
        onChange={(event) => setEv(1, Number(event.target.value))}
      />

      <label for="defense-ev-slider" class="block font-bold">Defense</label>
      <RangeInput
        step="4"
        min="0"
        max="252"
        value={evArray()[2]}
        onChange={(event) => setEv(2, Number(event.target.value))}
      />

      <label for="spdef-ev-slider" class="block font-bold">Sp. Defense</label>
      <RangeInput
        step="4"
        min="0"
        max="252"
        value={evArray()[4]}
        onChange={(event) => setEv(4, Number(event.target.value))}
      />

      <label for="spatk-ev-slider" class="block font-bold">Sp. Attack</label>
      <RangeInput
        step="4"
        min="0"
        max="252"
        value={evArray()[5]}
        onChange={(event) => setEv(5, Number(event.target.value))}
      />

      <label for="speed-ev-slider" class="block font-bold">Speed</label>
      <RangeInput
        type="range"
        step="4"
        min="0"
        max="252"
        value={evArray()[3]}
        onChange={(event) => setEv(3, Number(event.target.value))}
      />
      <div>
        <label for="ev-total" class="font-bold block">Total</label>
        <input
          id="ev-total"
          class="border border-solid border-slate-200 p-1"
          style={{
            // highlight text red if total evs exceed 510
            color: evSum() <= 510 ? "inherit" : "#dc2626",
          }}
          value={evSum()}
          disabled
        />
      </div>
    </>
  );
}

export default EvEditor;
