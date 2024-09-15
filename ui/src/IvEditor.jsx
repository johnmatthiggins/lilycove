import { hiddenPowerType } from "./utils/pokemonDataStructure";
import RangeInput from './RangeInput';
import PokemonType from './PokemonType';

function IvEditor({
  ivArray,
  setIvArray,
}) {
  const setIv = (index, newValue) => setIvArray(ivArray().with(index, newValue));
  return (
    <div class="text-gray-700">
      <h3 class="text-2xl font-bold text-gray-700" > IVs</h3 >
      <div class="flex flex-row gap-2">
        <section id="labels" class="flex flex-col gap-1">
          <label for="hp-iv-slider" class="min-h-9 font-bold">HP</label>
          <label for="attack-iv-slider" class="min-h-9 font-bold">Atk</label>
          <label for="defense-iv-slider" class="min-h-9 font-bold">Def</label>
          <label for="spdef-iv-slider" class="min-h-9 font-bold">SpD</label>
          <label for="spatk-iv-slider" class="min-h-9 font-bold">SpA</label>
          <label for="speed-iv-slider" class="min-h-9 font-bold">Spe</label>
        </section>
        <section class="flex flex-col gap-1">
          <RangeInput class="min-h-9" step="1" min="0" max="31" value={ivArray()[0]} onChange={(event) => {
            setIv(0, Number(event.target.value));
          }} />
          <RangeInput class="min-h-9" step="1" min="0" max="31" value={ivArray()[1]} onChange={(event) => {
            setIv(1, Number(event.target.value));
          }} />
          <RangeInput class="min-h-9" step="1" min="0" max="31" value={ivArray()[2]} onChange={(event) => {
            setIv(2, Number(event.target.value));
          }} />
          <RangeInput class="min-h-9" step="1" min="0" max="31" value={ivArray()[4]} onChange={(event) => {
            setIv(4, Number(event.target.value));
          }} />
          <RangeInput class="min-h-9" step="1" min="0" max="31" value={ivArray()[5]} onChange={(event) => {
            setIv(5, Number(event.target.value));
          }} />
          <RangeInput class="min-h-9" step="1" min="0" max="31" value={ivArray()[3]} onChange={(event) => {
            setIv(3, Number(event.target.value));
          }} />
        </section>
      </div>
      <div class="w-full">
        <h3 class="font-bold block">Hidden Power</h3>
        <div class="w-full flex">
          <PokemonType fullWidth typeName={() => hiddenPowerType(...ivArray())} />
        </div>
      </div>
    </div >
  );
}

export default IvEditor;
