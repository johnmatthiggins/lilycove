import { createMemo, createSignal, Show } from 'solid-js';

import { speciesList } from './PokemonList';
import { moveList } from './MoveList';
import PokemonType from './PokemonType';
import RangeInput from './RangeInput';
import { hiddenPowerType } from './utils/pokemonDataStructure';
import PokemonMove from './PokemonMove';

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

  const handleClick = () => setOpen(true);
  const hiddenPower = () => {
    const iv = pokemon.getIndividualValues();
    return hiddenPowerType(
      iv.hp,
      iv.attack,
      iv.defense,
      iv.speed,
      iv.specialAttack,
      iv.specialDefense
    );
  };
  const handleClose = () => setOpen(false);
  const blockClickCascade = (event) => event.stopPropagation();

  const pokemonMoves = () => pokemon
    .getMoveIds()
    .map((id) => moveList()
      .find((m) => Number(m.id) === Number(id)))
    .filter((m) => m);

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
            class="sharp-pixels pt-[5px] px-[5px]"
            src={imageURL()}
            loading="lazy"
          />
        </Show>
      </div>
      <div class="font-mono text-sm flex gap-1 flex-between px-2 items-center">
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
          style={{
            "z-index": 1000,
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            position: 'fixed',
          }}>
          <div
            class="shadow-sm border border-slate-200 border-solid mt-2 mx-[20vw] rounded-xl"
            style={{
              "backdrop-filter": "blur(10px)",
              "background-color": "rgba(255,255,255,0.7)",
            }}
          >
            <div onClick={blockClickCascade} class="w-fit px-1">
              <div class="flex flex-row">
                <div class="flex flex-col items-start">
                  <img
                    class="sharp-pixels hover:cursor-pointer w-32 mt-8 p-1 animate-bounce"
                    src={imageURL()}
                  />
                </div>
                <div class="text-left">
                  <h3 class="text-3xl font-bold font-mono">{pokemon.getName()} #{pokemon.getSpeciesId()}</h3>
                  <div class="flex gap-1">
                    {pokemonTypes().map((typeText) => {
                      return (
                        <PokemonType typeName={typeText} />
                      );
                    })}
                  </div>
                  <h3 class="text-2xl font-bold">Nature: {pokemon.getNature()}</h3>
                  <div class="flex flex-row gap-1">
                    <h3 class="text-2xl font-bold">Hidden Power:</h3>
                    <PokemonType typeName={hiddenPower()} />
                  </div>
                  <div class="flex flex-row gap-1 pt-1">
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
                      <RangeInput step="1" min="0" max="31" value={pokemon.getIndividualValues().hp} />

                      <label for="attack-iv-slider" class="block font-bold">Attack</label>
                      <RangeInput step="1" min="0" max="31" value={pokemon.getIndividualValues().attack} />

                      <label for="defense-iv-slider" class="block font-bold">Defense</label>
                      <RangeInput step="1" min="0" max="31" value={pokemon.getIndividualValues().defense} />

                      <label for="spdef-iv-slider" class="block font-bold">Sp. Defense</label>
                      <RangeInput step="1" min="0" max="31" value={pokemon.getIndividualValues().specialAttack} />

                      <label for="spatk-iv-slider" class="block font-bold">Sp. Attack</label>
                      <RangeInput step="1" min="0" max="31" value={pokemon.getIndividualValues().specialAttack} />

                      <label for="speed-iv-slider" class="block font-bold">Speed</label>
                      <RangeInput step="1" min="0" max="31" value={pokemon.getIndividualValues().speed} />
                    </div>
                    <div class="rounded-lg flex flex-col gap-1">
                      {pokemonMoves().map((move) => {
                        return (
                          <PokemonMove name={move.name} description={move.effect} pp={move.pp} moveType={move.move_type} />
                        );
                      })}
                    </div>
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
      </Show>
    </div >
  );
}

export default PokemonCard;
