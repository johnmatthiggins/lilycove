import { createMemo, createSignal, Show } from 'solid-js';

import { speciesList } from './PokemonList';
import { moveList } from './MoveList';
import PokemonType from './PokemonType';
import RangeInput from './RangeInput';
import { hiddenPowerType, NATURES } from './utils/pokemonDataStructure';
import PokemonMove from './PokemonMove';

function PokemonCard({ pokemon }) {
  const ivs = pokemon.getIndividualValues();
  const [ivArray, setIvArray] = createSignal([
    ivs.hp,
    ivs.attack,
    ivs.defense,
    ivs.speed,
    ivs.specialAttack,
    ivs.specialDefense,
  ]);
  const [speciesId, setSpeciesId] = createSignal(pokemon.getSpeciesId());

  let ref;
  const id = () => String(speciesId()).padStart(3, '0');
  const [open, setOpen] = createSignal(false);

  const pokemonTypes = createMemo(() => {
    const species = speciesList().find(({ species_id }) => Number(species_id) === Number(speciesId()));
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

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const blockClickCascade = (event) => event.stopPropagation();

  const setIv = (index, newValue) => setIvArray(ivArray().with(index, newValue));

  const pokemonMoves = () => pokemon
    .getMoveIds()
    .map((id) => moveList()
      .find((m) => Number(m.id) === Number(id)));

  return (
    <div
      class="flex flex-col w-32 h-32 hover:bg-teal-200 rounded-lg border border-solid border-teal-200 p-1 m-1"
      onClick={handleClick}
    >
      <div
        ref={ref}
        class="min-w-1/8 border-teal-200 flex justify-center grow hover:cursor-pointer"
      >
        <Show when={pokemon.hasSpecies()}>
          <img
            class="sharp-pixels pt-[5px] px-[5px]"
            src={imageURL()}
            loading="lazy"
          />
        </Show>
      </div>
      <div class="font-mono text-sm flex gap-1 flex-between px-2 items-center hover:cursor-pointer">
        <Show when={pokemon.hasSpecies()}>
          <img src={`/items/${pokemon.getPokeballItemId()}.png`} class="sharp-pixels" />
        </Show>
        <p class="text-xs text-center">{pokemon.getName()}</p>
        <Show when={pokemon.hasSpecies() && pokemon.isShiny()}>
          <img
            width={10}
            src="/star.svg"
            class="shiny-star"
            loading="lazy"
          />
        </Show>
      </div>

      <Show when={open()}>
        <div
          onClick={handleClose}
          class="flex justify-center"
          style={{
            "overflow-y": "hidden",
            "z-index": 1000,
            background: 'rgba(0, 0, 0, 0.3)',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            position: 'fixed',
          }}>
          <div
            class="shadow-sm border border-slate-200 border-solid mt-2 max-w-128 rounded-lg bg-white"
            style={{ height: 'fit-content' }}
          >
            <div onClick={blockClickCascade} class="w-full px-1 flex flex-col justify-between">
              <div class="flex flex-row justify-between">
                <div class="flex flex-col items-start gap-1">
                  <div>
                    <label class="font-bold block" for="nickname-input">Nickname</label>
                    <input
                      id="nickname-input"
                      type="text"
                      class="px-1 py-1 rounded-sm border border-solid border-slate-200 focus:outline focus:outline-solid focus:outline-teal-400 w-40"
                      value={pokemon.getName()}
                    />
                  </div>
                  <div class="w-full flex justify-center">
                    <img
                      class="sharp-pixels hover:cursor-pointer w-32 mt-2 p-1"
                      src={imageURL()}
                    />
                  </div>
                  <div class="flex gap-1">
                    <For each={pokemonTypes()}>
                      {(typeText) => {
                        return (
                          <PokemonType typeName={() => typeText} />
                        );
                      }}
                    </For>
                  </div>
                  <div>
                    <label class="font-bold block" for="species-input">Species</label>
                    <select
                      id="species-input"
                      value={speciesId()}
                      onChange={(event) => setSpeciesId(event.target.value)}
                      class="border border-solid border-slate-200 bg-white px-1 py-1.5 rounded-sm focus:border-white focus:outline focus:outline-solid focus:outline-teal-400"
                    >
                      <For each={speciesList().toSorted((a, b) => a.pokedex_id - b.pokedex_id)}>
                        {(species) => {
                          return (
                            <option value={species.species_id}>
                              {species.name} #{species.pokedex_id}
                            </option>
                          );
                        }}
                      </For>
                    </select>
                  </div>
                  <div>
                    <label class="font-bold block" for="nature-input">Nature</label>
                    <select
                      id="nature-input"
                      class="border border-solid border-slate-200 bg-white px-1 py-1.5 rounded-sm focus:border-white focus:outline focus:outline-solid focus:outline-teal-400"
                    >
                      <For each={NATURES}>
                        {(nature) => {
                          return (
                            <option
                              value={nature.name}
                              class="font-bold"
                              selected={nature.name === pokemon.getNature().name ? "selected" : undefined}
                            >
                              {nature.name}&nbsp;
                              <Show when={nature.increase != nature.decrease}>
                                (+{nature.increase},-{nature.decrease})
                              </Show>
                            </option>
                          );
                        }}
                      </For>
                    </select>
                  </div>
                  <div class="w-full">
                    <h3 class="font-bold block">Hidden Power</h3>
                    <div class="w-full flex">
                      <PokemonType fullWidth typeName={() => hiddenPowerType(...ivArray())} />
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-1 pt-1">
                  <div class="border border-solid border-slate-200 p-2 rounded-lg bg-white">
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
                  <div class="border border-solid border-slate-200 p-2 rounded-lg bg-white">
                    <h3 class="text-2xl font-bold">IVs</h3>
                    <label for="hp-iv-slider" class="block font-bold">HP</label>
                    <RangeInput step="1" min="0" max="31" value={pokemon.getIndividualValues().hp} onChange={(event) => {
                      setIv(0, Number(event.target.value));
                    }} />

                    <label for="attack-iv-slider" class="block font-bold">Attack</label>
                    <RangeInput step="1" min="0" max="31" value={pokemon.getIndividualValues().attack} onChange={(event) => {
                      setIv(1, Number(event.target.value));
                    }} />

                    <label for="defense-iv-slider" class="block font-bold">Defense</label>
                    <RangeInput step="1" min="0" max="31" value={pokemon.getIndividualValues().defense} onChange={(event) => {
                      setIv(2, Number(event.target.value));
                    }} />

                    <label for="spdef-iv-slider" class="block font-bold">Sp. Defense</label>
                    <RangeInput step="1" min="0" max="31" value={pokemon.getIndividualValues().specialAttack} onChange={(event) => {
                      setIv(4, Number(event.target.value));
                    }} />

                    <label for="spatk-iv-slider" class="block font-bold">Sp. Attack</label>
                    <RangeInput step="1" min="0" max="31" value={pokemon.getIndividualValues().specialAttack} onChange={(event) => {
                      setIv(5, Number(event.target.value));
                    }} />

                    <label for="speed-iv-slider" class="block font-bold">Speed</label>
                    <RangeInput step="1" min="0" max="31" value={pokemon.getIndividualValues().speed} onChange={(event) => {
                      setIv(3, Number(event.target.value));
                    }} />
                  </div>
                </div>
              </div>
              <div class="rounded-lg grid grid-cols-2 gap-1 pt-1">
                <For each={pokemonMoves()}>
                  {(move) => {
                    return (
                      <PokemonMove moveId={move?.id || -1} />
                    );
                  }}
                </For>
              </div>
            </div>
            <div class="flex flex-row justify-center w-full grow my-1 gap-3">
              <button
                class="font-bold hover:bg-red-400 border border-solid border-red-400 text-red-400 hover:text-white px-4 py-1 rounded-sm w-32"
                onClick={(event) => {
                  event.stopPropagation();
                  setOpen(false);
                }}>
                Cancel
              </button>
              <button
                class="font-bold hover:bg-teal-400 border border-solid border-teal-400 text-teal-400 hover:text-white px-4 py-1 rounded-sm w-32"
                onClick={(event) => {
                  event.stopPropagation();
                  setOpen(false);
                }}>
                Save
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div >
  );
}

export default PokemonCard;
