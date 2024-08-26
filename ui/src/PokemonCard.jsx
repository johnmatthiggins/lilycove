import { createMemo, createSignal, Show } from 'solid-js';

import { speciesList } from './PokemonList';
import { moveList } from './MoveList';
import PokemonType from './PokemonType';
import { NATURES } from './utils/pokemonDataStructure';
import PokemonMove from './PokemonMove';
import IvEditor from './IvEditor';
import EvEditor from './EvEditor';
import Selector from './Selector';


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
  const [nature, getNature] = createSignal(pokemon.getNature());

  const [abilityIndex, setAbilityIndex] = createSignal(pokemon.getAbilityBit());
  const pokemonSpecies = createMemo(() =>
    speciesList()
      .find(
        ({ species_id }) => Number(species_id) === Number(speciesId())
      )
  );

  const abilityList = () => pokemonSpecies().abilities;

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
                      {(typeText) => (<PokemonType typeName={() => typeText} />)}
                    </For>
                  </div>
                  <div>
                    <Selector
                      id="species-input"
                      label="Species"
                      onChange={(event) => setSpeciesId(Number(event.target.value))}
                      selectedValue={speciesId}
                      options={() =>
                        speciesList()
                          .toSorted((a, b) => a.pokedex_id - b.pokedex_id)
                          .map((species) => {
                            const label = `${String(species.pokedex_id).padStart(3, '0')} ${species.name}`;
                            const value = species.species_id;
                            return { label, value };
                          })
                      }
                    />
                  </div>
                  <div>
                    <Selector
                      id="ability-input"
                      label="Ability"
                      selectedValue={() => abilityIndex() % abilityList().length}
                      options={() => abilityList().map((ability, index) => ({ value: index, label: ability }))}
                    />
                  </div>
                  <div>
                    <Selector
                      options={() => NATURES.map(({ name, increase, decrease }) => {
                        let result;
                        if (increase === decrease) {
                          result = { value: name, label: name };
                        } else {
                          const natureLabel = `${name} (+${increase},-${decrease})`;
                          result = { value: name, label: natureLabel };
                        }
                        return result;
                      })}
                      id="nature-input"
                      label="Nature"
                      selectedValue={nature}
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-1 pt-1">
                  <div>
                    <EvEditor evArray={evArray} setEvArray={setEvArray} />
                  </div>
                  <div class="border border-solid border-slate-200 p-2 rounded-md bg-white">
                    <IvEditor ivArray={ivArray} setIvArray={setIvArray} />
                  </div>
                </div>
              </div>
              <div class="rounded-lg grid grid-cols-2 gap-1 pt-1">
                <For each={pokemonMoves()}>
                  {(move) => (<PokemonMove moveId={move?.id || -1} />)}
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
