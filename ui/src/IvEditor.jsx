import { hiddenPowerType } from "./utils/pokemonDataStructure";
import RangeInput from './RangeInput';
import PokemonType from './PokemonType';

function IvEditor({
  ivArray,
  setIvArray,
}) {
  const setIv = (index, newValue) => setIvArray(ivArray().with(index, newValue));
  return (
    <>
      <h3 class="text-2xl font-bold">IVs</h3>
      <label for="hp-iv-slider" class="block font-bold">HP</label>
      <RangeInput step="1" min="0" max="31" value={ivArray()[0]} onChange={(event) => {
        setIv(0, Number(event.target.value));
      }} />

      <label for="attack-iv-slider" class="block font-bold">Attack</label>
      <RangeInput step="1" min="0" max="31" value={ivArray()[1]} onChange={(event) => {
        setIv(1, Number(event.target.value));
      }} />

      <label for="defense-iv-slider" class="block font-bold">Defense</label>
      <RangeInput step="1" min="0" max="31" value={ivArray()[2]} onChange={(event) => {
        setIv(2, Number(event.target.value));
      }} />

      <label for="spdef-iv-slider" class="block font-bold">Sp. Defense</label>
      <RangeInput step="1" min="0" max="31" value={ivArray()[4]} onChange={(event) => {
        setIv(4, Number(event.target.value));
      }} />

      <label for="spatk-iv-slider" class="block font-bold">Sp. Attack</label>
      <RangeInput step="1" min="0" max="31" value={ivArray()[5]} onChange={(event) => {
        setIv(5, Number(event.target.value));
      }} />

      <label for="speed-iv-slider" class="block font-bold">Speed</label>
      <RangeInput step="1" min="0" max="31" value={ivArray()[3]} onChange={(event) => {
        setIv(3, Number(event.target.value));
      }} />
      <div class="w-full">
        <h3 class="font-bold block">Hidden Power</h3>
        <div class="w-full flex">
          <PokemonType fullWidth typeName={() => hiddenPowerType(...ivArray())} />
        </div>
      </div>
    </>
  );
}

export default IvEditor;
