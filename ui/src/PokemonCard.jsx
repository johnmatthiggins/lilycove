import { createMemo, createSignal, Show } from 'solid-js';

import { speciesList } from './PokemonList';
import { moveList } from './MoveList';
import PokemonType from './PokemonType';
import NATURES from './utils/Natures';
import PokemonMove from './PokemonMove';
import IvEditor from './IvEditor';
import EvEditor from './EvEditor';
import Selector from './Selector';
import { setBits, bits } from './fileBits';
import { recomputeSaveChecksums } from './utils/save';

function PokemonCard({ pokemon }) {
  const ivs = pokemon().getIndividualValues();
  const evs = pokemon().getEffortValues();
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
  const [ppIncreases, setPpIncreases] = createSignal(pokemon().getPowerPointIncreases());

  const speciesId = () => pokemon().getSpeciesId();
  const setSpeciesId = (id) => pokemon().setSpeciesId(id);
  const [nickname, setNickname] = createSignal(pokemon().getName());
  const [nature, setNature] = createSignal(pokemon().getNature());

  const abilityIndex = () => pokemon().getAbilityBit();
  const setAbilityIndex = (value) => pokemon().setAbilityBit(value);
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

  const [isShiny, setIsShiny] = createSignal(pokemon().isShiny());
  const imageURL = () => {
    if (isShiny()) {
      return `/api/pokemon-images/${id()}s.png`;
    }
    return `/api/pokemon-images/${id()}.png`;
  };

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const blockClickCascade = (event) => event.stopPropagation();

  const pokemonMoves = () => pokemon()
    .getMoveIds()
    .map((id) => moveList()
      .find((m) => Number(m.id) === Number(id)));

  const [tab, setTab] = createSignal('moves');

  return (
    <div
      class="rounded-sm flex flex-col w-32 h-32 hover:bg-gray-400 border border-solid border-gray-400 p-1 m-1"
      onClick={handleClick}
    >
      <div
        ref={ref}
        class="min-w-1/8 border-gray-400 flex justify-center grow hover:cursor-pointer"
      >
        <Show when={pokemon().hasSpecies()}>
          <img
            class="sharp-pixels pt-[5px] px-[5px]"
            src={imageURL()}
            loading="lazy"
          />
        </Show>
      </div>
      <div class="font-mono text-sm flex gap-1 justify-between px-1 items-center hover:cursor-pointer">
        <Show when={pokemon().hasSpecies()}>
          <img src={`/items/${pokemon().getPokeballItemId()}.png`} class="sharp-pixels w-5" />
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
            class="border border-gray-400 border-solid mt-2 min-w-[65vw] rounded-sm bg-white p-2"
            style={{ height: 'fit-content' }}
          >
            <div onClick={blockClickCascade} class="w-full px-1 flex flex-col justify-between">
              <div class="flex flex-row justify-start gap-2">
                <div class="flex flex-col items-start gap-1">
                  <div>
                    <label class="font-bold block" for="nickname-input">Nickname</label>
                    <div class="flex flex-row gap-2">
                      <input
                        id="nickname-input"
                        type="text"
                        class="px-1 py-1 rounded-sm border border-solid border-gray-400 focus:outline-2 focus:outline-solid focus:outline-emerald-400 w-36"
                        onInput={(event) => setNickname(event.target.value)}
                        value={nickname()}
                      />
                      <img
                        src={isShiny() ? "/star.svg" : "/empty-star.svg"}
                        onClick={() => setIsShiny((prev) => !prev)}
                        class="shiny-star w-4 hover:cursor-pointer"
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
                      class="w-44"
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
                      class="w-44"
                      label="Ability"
                      selectedValue={() => abilityIndex() % abilityList().length}
                      options={() => abilityList().map((ability, index) => ({ value: index, label: ability }))}
                      onChange={(event) => setAbilityIndex(Number(event.target.value))}
                    />
                  </div>
                  <div>
                    <Selector
                      options={() => NATURES.map(({ name, increase, decrease }) => {
                        let result;
                        if (increase === decrease) {
                          result = { value: name, label: name };
                        } else {
                          result = { value: name, label: `${name} (+${increase},-${decrease})` };
                        }
                        return result;
                      })}
                      id="nature-input"
                      class="w-44"
                      label="Nature"
                      onChange={(event) => setNature(NATURES.find((n) => n.name === event.target.value))}
                      selectedValue={() => nature().name}
                    />
                  </div>
                </div>
                <div class="pt-1 w-full">
                  <ul id="tabs" class="flex gap-1">
                    <li
                      onClick={() => setTab("moves")}
                      class="px-2 font-bold hover:underline hover:cursor-pointer"
                      style={{
                        'border-top-right-radius': '0.25em',
                        'border-top-left-radius': '0.25em',
                        'border-top-color': '#9ca3af',
                        'border-right-color': '#9ca3af',
                        'border-left-color': '#9ca3af',
                        'border-top-style': 'solid',
                        'border-right-style': 'solid',
                        'border-left-style': 'solid',
                        'border-width': '0.0625em',
                      }}
                    >
                      Moves
                    </li>
                    <li
                      class="px-2 font-bold hover:underline hover:cursor-pointer"
                      onClick={() => setTab("stats")}
                      style={{
                        'border-top-right-radius': '0.25em',
                        'border-top-left-radius': '0.25em',
                        'border-top-color': '#9ca3af',
                        'border-right-color': '#9ca3af',
                        'border-left-color': '#9ca3af',
                        'bordre-bottom-color': 'white',
                        'border-top-style': 'solid',
                        'border-right-style': 'solid',
                        'border-left-style': 'solid',
                        'border-width': '0.0625em',
                      }}
                    >
                      Stats
                    </li>
                  </ul>
                  <div
                    class="border border-gray-400 border-solid flex flex-row justify-start grow"
                    style={{
                      "border-bottom-right-radius": '0.125em',
                      "border-bottom-left-radius": '0.125em',
                    }}
                  >
                    <Show when={tab() === "moves"}>
                      <div class="flex flex-col gap-1 p-1 grow" id="moveset">
                        <For each={pokemonMoves()}>
                          {(move, index) => (<PokemonMove
                            moveId={move?.id || -1}
                            ppUpCount={() => ppIncreases()[index()]}
                            setPpUpCount={(nextValue) =>
                              setPpIncreases(ppIncreases().with(index(), nextValue))
                            }
                            onChange={(moveId) => pokemon().setMove(index(), moveId)}
                          />)}
                        </For>
                      </div>
                    </Show>
                    <Show when={tab() === "stats"}>
                      <div class="grid grid-cols-2 gap-1" id="stats">
                        <div class="p-2">
                          <EvEditor evArray={evArray} setEvArray={setEvArray} />
                        </div>
                        <div class="p-2">
                          <IvEditor ivArray={ivArray} setIvArray={setIvArray} />
                        </div>
                      </div>
                    </Show>
                    <Show when={tab() === "extra"}>
                      <div>
                      </div>
                    </Show>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-row justify-center w-full grow my-1 pt-2 gap-3">
              <button
                class="font-bold hover:bg-red-400 border border-solid border-red-400 text-red-400 hover:text-red-100 px-4 py-1 rounded-sm w-32"
                onClick={(event) => {
                  event.stopPropagation();
                  setOpen(false);
                }}>
                Cancel
              </button>
              <button
                class="font-bold hover:bg-emerald-400 border border-solid border-emerald-400 text-emerald-400 hover:text-emerald-100 px-4 py-1 rounded-sm w-32"
                onClick={(event) => {
                  const save = bits();
                  const pokemonRef = pokemon();
                  pokemonRef.recomputeChecksum();

                  // serialize pokemon to binary
                  pokemonRef.save(save);

                  recomputeSaveChecksums(save);
                  setBits([...save]);
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
