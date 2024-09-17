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
      <h3 class="text-2xl font-bold text-gray-700 pb-1">IVs</h3>
      <div class="flex flex-row gap-2">
        <section class="flex flex-col gap-1">
          <RangeInput slider={false} class="min-h-9" step="1" min="0" max="31" value={() => ivArray()[0]} onChange={(event) => {
            setIv(0, Number(event.target.value));
          }} />
          <RangeInput slider={false} class="min-h-9" step="1" min="0" max="31" value={() => ivArray()[1]} onChange={(event) => {
            setIv(1, Number(event.target.value));
          }} />
          <RangeInput slider={false} class="min-h-9" step="1" min="0" max="31" value={() => ivArray()[2]} onChange={(event) => {
            setIv(2, Number(event.target.value));
          }} />
          <RangeInput slider={false} class="min-h-9" step="1" min="0" max="31" value={() => ivArray()[4]} onChange={(event) => {
            setIv(4, Number(event.target.value));
          }} />
          <RangeInput slider={false} class="min-h-9" step="1" min="0" max="31" value={() => ivArray()[5]} onChange={(event) => {
            setIv(5, Number(event.target.value));
          }} />
          <RangeInput slider={false} class="min-h-9" step="1" min="0" max="31" value={() => ivArray()[3]} onChange={(event) => {
            setIv(3, Number(event.target.value));
          }} />
        </section>
        <section class="flex flex-col gap-1">
          <button
            class="bg-white text-black text-center hover:outline hover:outline-2 hover:outline-black hover:outline-solid border-2 border-2-solid border-2-gray-200 px-1 min-h-9 rounded-md hover:cursor-pointer hover:shadow-md shadow-sm font-bold"
            onClick={() => setIv(0, 31)}
          >
            MAX
          </button>
          <button
            class="bg-white text-black text-center hover:outline hover:outline-2 hover:outline-black hover:outline-solid border-2 border-2-solid border-2-gray-200 px-1 min-h-9 rounded-md hover:cursor-pointer hover:shadow-md shadow-sm font-bold"
            onClick={() => setIv(1, 31)}
          >
            MAX
          </button>
          <button
            class="bg-white text-black text-center hover:outline hover:outline-2 hover:outline-black hover:outline-solid border-2 border-2-solid border-2-gray-200 px-1 min-h-9 rounded-md hover:cursor-pointer hover:shadow-md shadow-sm font-bold"
            onClick={() => setIv(2, 31)}
          >
            MAX
          </button>
          <button
            class="bg-white text-black text-center hover:outline hover:outline-2 hover:outline-black hover:outline-solid border-2 border-2-solid border-2-gray-200 px-1 min-h-9 rounded-md hover:cursor-pointer hover:shadow-md shadow-sm font-bold"
            onClick={() => setIv(4, 31)}
          >
            MAX
          </button>
          <button
            class="bg-white text-black text-center hover:outline hover:outline-2 hover:outline-black hover:outline-solid border-2 border-2-solid border-2-gray-200 px-1 min-h-9 rounded-md hover:cursor-pointer hover:shadow-md shadow-sm font-bold"
            onClick={() => setIv(5, 31)}
          >
            MAX
          </button>
          <button
            class="bg-white text-black text-center hover:outline hover:outline-2 hover:outline-black hover:outline-solid border-2 border-2-solid border-2-gray-200 px-1 min-h-9 rounded-md hover:cursor-pointer hover:shadow-md shadow-sm font-bold"
            onClick={() => setIv(3, 31)}
          >
            MAX
          </button>
        </section>
      </div>
    </div>
  );
}

export default IvEditor;
