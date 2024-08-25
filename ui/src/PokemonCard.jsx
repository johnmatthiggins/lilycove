import { createMemo, createSignal, Show } from 'solid-js';

import { speciesList } from './PokemonList';
import { moveList } from './MoveList';
import PokemonType from './PokemonType';
import RangeInput from './RangeInput';
import { hiddenPowerType, NATURES } from './utils/pokemonDataStructure';
import PokemonMove from './PokemonMove';

function PokemonCard({ pokemon }) {
  const ivs = pokemon.getIndividualValues();
  const evs = pokemon.getEffortValues();
  const [ivArray, setIvArray] = createSignal([
    ivs.hp,
    ivs.attack,
    ivs.defense,
    ivs.speed,
    ivs.specialAttack,
    ivs.specialDefense,
  ]);
  const [evArray, setEvArray] = createSignal([
    evs.hp,
    evs.attack,
    evs.defense,
    evs.speed,
    evs.specialAttack,
    evs.specialDefense,
  ]);
  const [speciesId, setSpeciesId] = createSignal(pokemon.getSpeciesId());
  const [nickname, setNickname] = createSignal(pokemon.getName());

  const [abilityIndex, setAbilityIndex] = createSignal(pokemon.getAbilityBit());
  const pokemonSpecies = createMemo(() =>
    speciesList()
      .find(
        ({ species_id }) => Number(species_id) === Number(speciesId())
      )
  );

  const abilityList = () => pokemonSpecies().abilities;

  const evSum = () => evArray().reduce((a, b) => a + b);

  let ref;
  let imageRef;
  const id = () => String(speciesId()).padStart(3, '0');
  const [open, setOpen] = createSignal(false);

  const pokemonTypes = createMemo(() => {
    const species = pokemonSpecies();
    if (!species) {
      return ['???'];
    }
    if (species?.type1 === species?.type2) {
      return [species?.type1];
    }
    return [species?.type1, species?.type2];
  });

  const [isShiny, setIsShiny] = createSignal(pokemon.isShiny());
  const imageURL = () => {
    if (isShiny()) {
      return `/api/pokemon-images/${id()}s.png`;
    }
    return `/api/pokemon-images/${id()}.png`;
  };

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const blockClickCascade = (event) => event.stopPropagation();

  const setIv = (index, newValue) => setIvArray(ivArray().with(index, newValue));
  const setEv = (index, newValue) => setEvArray(evArray().with(index, newValue));

  const pokemonMoves = () => pokemon
    .getMoveIds()
    .map((id) => moveList()
      .find((m) => Number(m.id) === Number(id)));

  return (
    <div
      class="rounded-sm flex flex-col w-32 h-32 hover:bg-teal-200 border border-solid border-teal-200 p-1 m-1"
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
      <div class="font-mono text-sm flex gap-1 justify-between px-1 items-center hover:cursor-pointer">
        <Show when={pokemon.hasSpecies()}>
          <img src={`/items/${pokemon.getPokeballItemId()}.png`} class="sharp-pixels w-5" />
          <p class="text-xs text-center">{nickname()}</p>
          <img
            src={isShiny() ? "/star.svg" : "/empty-star.svg"}
            class="shiny-star w-3"
            loading="lazy"
          />
        </Show>
      </div>

      <Show when={open()}>
        <dialog
          open
          onClick={handleClose}
          class="flex justify-center font-sans"
          style={{
            overflow: "hidden",
            "z-index": 1000,
            background: 'rgba(0, 0, 0, 0.3)',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            position: 'fixed',
          }}
        >
          <div
            class="shadow-sm border border-slate-200 border-solid mt-2 min-w-[65vw] rounded-lg bg-white p-2"
            style={{ height: 'fit-content' }}
          >
            <div onClick={blockClickCascade} class="w-full px-1 flex flex-col justify-between">
              <div class="flex flex-row justify-between">
                <div class="flex flex-col items-start gap-1">
                  <div>
                    <label class="font-bold block" for="nickname-input">Nickname</label>
                    <div class="flex flex-row gap-2">
                      <input
                        id="nickname-input"
                        type="text"
                        class="px-1 py-1 rounded-sm border border-solid border-slate-200 focus:outline focus:outline-solid focus:outline-teal-400 w-32"
                        onInput={(event) => setNickname(event.target.value)}
                        value={nickname()}
                      />
                      <img
                        src={isShiny() ? "/star.svg" : "/empty-star.svg"}
                        onClick={() => setIsShiny((prev) => !prev)}
                        class="shiny-star w-5 hover:cursor-pointer"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div class="w-full flex justify-center">
                    <img
                      ref={imageRef}
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
                              {String(species.pokedex_id).padStart(3, '0')} {species.name}
                            </option>
                          );
                        }}
                      </For>
                    </select>
                  </div>
                  <div>
                    <label class="font-bold block" for="ability-input">Ability</label>
                    <select
                      id="ability-input"
                      value={abilityIndex() % abilityList().length}
                      class="border border-solid border-slate-200 bg-white px-1 py-1.5 focus:border-white focus:outline focus:outline-solid focus:outline-teal-400"
                    >
                      <For each={abilityList()}>
                        {(ability, index) => (<option value={index()}>{ability}</option>)}
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
                </div>
                <div class="grid grid-cols-2 gap-1 pt-1">
                  <div class="border border-solid border-slate-200 p-2 rounded-md bg-white">
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
                  </div>
                  <div class="border border-solid border-slate-200 p-2 rounded-md bg-white">
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
                    <div class="w-full">
                      <h3 class="font-bold block">Hidden Power</h3>
                      <div class="w-full flex">
                        <PokemonType fullWidth typeName={() => hiddenPowerType(...ivArray())} />
                      </div>
                    </div>
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
            <div class="flex flex-row justify-center w-full grow my-1 pt-2 gap-3">
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
        </dialog>
      </Show>
    </div>
  );
}

export default PokemonCard;
