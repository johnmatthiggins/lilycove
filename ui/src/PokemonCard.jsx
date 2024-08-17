import { createMemo, createSignal, Show } from 'solid-js';

import { speciesList } from './PokemonList';
import PokemonType from './PokemonType';
import RangeInput from './RangeInput';

function PokemonCard({ pokemon }) {
  let ref;
  const id = () => String(pokemon.getSpeciesId()).padStart(3, '0');
  const [open, setOpen] = createSignal(false);

  const pokemonTypes = createMemo(() => {
    const targetId = pokemon.getSpeciesId();
    const species = speciesList().find(({ species_id }) => species_id === targetId);
    if (!species) {
      return ['???'];
    }
    if (species?.type1 === species?.type2) {
      return [species?.type1];
    }
    return [species?.type1, species?.type2];
  });

  const imageURL = () => {
    if (pokemon.isShiny()) {
      return `/api/pokemon-images/${id()}s.png`;
    }
    return `/api/pokemon-images/${id()}.png`;
  };

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <div
      class="flex flex-col w-32 h-32 hover:bg-green-200 transition rounded-lg border border-solid border-green-200 p-1 m-1 hover:cursor-pointer"
      onClick={handleClick}
    >
      <div
        ref={ref}
        class="min-w-1/8 border-green-200 flex justify-center grow"
      >
        <Show when={pokemon.hasSpecies()}>
          <img
            class="sharp-pixels pt-[5px] hover:pt-[2px] px-[5px] hover:pb-[3px] transition"
            src={imageURL()}
            loading="lazy"
          />
        </Show>
      </div>
      <div>
        <p class="font-mono text-sm text-center flex gap-1 flex-between px-2">
          {pokemon.getName()}
          <Show when={pokemon.hasSpecies() && pokemon.isShiny()}>
            <img
              width={10}
              src="/star.svg"
              class="shiny-star"
              loading="lazy"
            />
          </Show>
        </p>
      </div>

      <div
        class="shadow-sm border border-slate-200 border-solid"
        style={{
          "backdrop-filter": "blur(10px)",
          background: 'white',
          display: open() && pokemon.hasSpecies() ? 'block' : 'none',
          position: 'fixed',
          "z-index": 1000,
          top: '20vh',
          width: '50vw',
        }}
      >
        <div class="flex flex-row">
          <div class="flex items-start">
            <img
              class="sharp-pixels hover:cursor-pointer w-[100px] p-[5px]"
              src={imageURL()}
            />
          </div>
          <div class="text-left">
            <h3 class="text-3xl font-bold font-mono">{pokemon.getName()}</h3>
            <div class="flex gap-1">
              {pokemonTypes().map((typeText) => {
                return (
                  <PokemonType typeName={typeText} />
                )
              })}
            </div>
            <h3 class="text-3xl font-bold">Nature: {pokemon.getNature()}</h3>
            <div class="flex flex-row gap-1">
              <div>
                <h3 class="text-2xl font-bold">EVs</h3>
                <label for="hp-ev-slider" class="block font-bold">HP</label>
                <RangeInput step="4" min="0" max="252" value={pokemon.getEffortValues().HP} />

                <label for="attack-ev-slider" class="block font-bold">Attack</label>
                <RangeInput step="4" min="0" max="252" value={pokemon.getEffortValues().Attack} />

                <label for="defense-ev-slider" class="block font-bold">Defense</label>
                <RangeInput step="4" min="0" max="252" value={pokemon.getEffortValues().Defense} />

                <label for="spdef-ev-slider" class="block font-bold">Sp. Defense</label>
                <RangeInput step="4" min="0" max="252" value={pokemon.getEffortValues()["Special Attack"]} />

                <label for="spatk-ev-slider" class="block font-bold">Sp. Attack</label>
                <RangeInput step="4" min="0" max="252" value={pokemon.getEffortValues()["Special Defense"]} />

                <label for="speed-ev-slider" class="block font-bold">Speed</label>
                <RangeInput type="range" step="4" min="0" max="252" value={pokemon.getEffortValues().Speed} />
              </div>
              <div>
                <h3 class="text-2xl font-bold">IVs</h3>
                <h3 class="text-xl">HP: {pokemon.getIndividualValues().hp}</h3>
                <h3 class="text-xl">Attack: {pokemon.getIndividualValues().attack}</h3>
                <h3 class="text-xl">Defense: {pokemon.getIndividualValues().defense}</h3>
                <h3 class="text-xl">Speed: {pokemon.getIndividualValues().speed}</h3>
                <h3 class="text-xl">SpAtk.: {pokemon.getIndividualValues().specialAttack}</h3>
                <h3 class="text-xl">SpDef.: {pokemon.getIndividualValues().specialDefense}</h3>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row justify-center w-full grow my-1">
          <button
            class="hover:bg-green-400 border border-solid border-green-400 text-green-400 hover:text-white px-4 py-1 rounded-md transition"
            onClick={(event) => {
              event.stopPropagation();
              setOpen(false);
            }}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
