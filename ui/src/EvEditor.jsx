import RangeInput from './RangeInput';

function EvEditor({ evArray, setEvArray }) {
  const evSum = () => evArray().reduce((a, b) => a + b);
  const setEv = (index, newValue) => setEvArray(evArray().with(index, newValue));
  return (
    <div class="text-gray-700">
      <h3 class="text-2xl font-bold">EVs</h3>
      <div class="flex flex-row gap-2">
        <section id="labels" class="flex flex-col gap-1">
          <div class="min-h-9 flex items-center">
            <label for="hp-ev-slider" class="font-bold">HP</label>
          </div>
          <div class="min-h-9 flex items-center">
            <label for="attack-ev-slider" class="font-bold text-center">Atk</label>
          </div>
          <div class="min-h-9 flex items-center">
            <label for="defense-ev-slider" class="font-bold">Def</label>
          </div>
          <div class="min-h-9 flex items-center">
            <label for="spdef-ev-slider" class="font-bold">SpD</label>
          </div>
          <div class="min-h-9 flex items-center">
            <label for="spatk-ev-slider" class="font-bold">SpA</label>
          </div>
          <div class="min-h-9 flex items-center">
            <label for="speed-ev-slider" class="font-bold">Spe</label>
          </div>
        </section>
        <section id="ev-inputs" class="flex flex-col gap-1">
          <RangeInput
            class="min-h-9"
            step="4"
            min="0"
            max="252"
            value={evArray()[0]}
            onChange={(event) => setEv(0, Number(event.target.value))}
          />

          <RangeInput
            class="min-h-9"
            step="4"
            min="0"
            max="252"
            value={evArray()[1]}
            onChange={(event) => setEv(1, Number(event.target.value))}
          />

          <RangeInput
            class="min-h-9"
            step="4"
            min="0"
            max="252"
            value={evArray()[2]}
            onChange={(event) => setEv(2, Number(event.target.value))}
          />

          <RangeInput
            class="min-h-9"
            step="4"
            min="0"
            max="252"
            value={evArray()[4]}
            onChange={(event) => setEv(4, Number(event.target.value))}
          />

          <RangeInput
            class="min-h-9"
            step="4"
            min="0"
            max="252"
            value={evArray()[5]}
            onChange={(event) => setEv(5, Number(event.target.value))}
          />

          <RangeInput
            class="min-h-9"
            type="range"
            step="4"
            min="0"
            max="252"
            value={evArray()[3]}
            onChange={(event) => setEv(3, Number(event.target.value))}
          />
        </section>
      </div>
      <div>
        <label for="ev-total" class="font-bold block text-gray-700">Total</label>
        <input
          id="ev-total"
          class="border border-solid border-gray-400 rounded-md px-1 min-h-9"
          style={{
            // highlight text red if total evs exceed 510
            color: evSum() <= 510 ? "inherit" : "#dc2626",
          }}
          value={evSum()}
          disabled
        />
      </div>
    </div>
  );
}

export default EvEditor;
