import { onMount, createMemo, createSignal, Show } from 'solid-js';

import BoxPokemon from './BoxPokemon';
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
import { itemList } from './ItemList';
import PokemonTextInput from './PokemonTextInput';
import StatDisplay from './StatDisplay';

function PokemonEditorDialog({
  onClose,
  pokemonData,
  setPokemonData,
}) {
  const [tab, setTab] = createSignal('moves');
  const ivs = pokemonData().getIndividualValues();
  const evs = pokemonData().getEffortValues();
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
  const ppIncreases = () => pokemonData().getPowerPointIncreases();
  const setPPIncreases = (ppUps) => {
    pokemonData().setPowerPointIncreases(ppUps);
    setPokemonData(pokemonData().copy());
  };
  const itemCode = () => pokemonData().getItemCode();
  const setItemCode = (code) => {
    pokemonData().setItemCode(code);
    setPokemonData((p) => p.copy());
  };

  const experience = () => pokemonData().getExperiencePoints();
  const setExperience = (value) => {
    const pokemonRef = pokemonData();
    pokemonRef.setExperiencePoints(value)
    setPokemonData(pokemonRef.copy());
  };

  const speciesId = () => pokemonData().getSpeciesId();
  const setSpeciesId = (id) => {
    pokemonData().setSpeciesId(id);
    setPokemonData((p) => p.copy());
  };
  const nickname = () => pokemonData().getNicknameBytes();
  const setNickname = (bytes) => {
    pokemonData().setNicknameBytes(bytes);
    setPokemonData(pokemonData().copy());
  };

  const nature = () => pokemonData().getNature();
  const setNature = (natureIndex) => {
    const personalityValue = pokemonData().getPersonalityValue();
    const mod = personalityValue % BigInt(NATURES.length);
    const distance = mod - BigInt(natureIndex);

    pokemonData().setPersonalityValue(personalityValue - distance);
    setPokemonData(pokemonData().copy());
  };

  const abilityIndex = () => pokemonData().getAbilityBit();
  const setAbilityIndex = (value) => {
    pokemonData().setAbilityBit(Number(value));
    setPokemonData((p) => p.copy());
  };

  const pokeballIndex = () => Number(pokemonData().getPokeballItemId());
  const setPokeballIndex = (itemId) => pokemonData().setPokeballWithItemId(itemId);

  const pokemonSpecies = () =>
    speciesList()
      .find(
        ({ species_id }) => Number(species_id) === Number(speciesId())
      );

  const level = () => {
    const levelTable = BoxPokemon.buildLevelTable(pokemonSpecies().growth_rate);
    const levelIndex = levelTable.findLastIndex((e) => (e <= experience()));

    return levelIndex + 1;
  };
  const setLevel = (newLevel) => {
    const levelTable = BoxPokemon.buildLevelTable(pokemonSpecies().growth_rate);
    const clamped = newLevel % 101;
    const newExpValue = levelTable[clamped - 1];
    setExperience(newExpValue);
  };

  const abilityList = () => pokemonSpecies().abilities;

  let imageRef;
  const id = () => String(speciesId()).padStart(3, '0');

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

  const [isShiny, setIsShiny] = createSignal(pokemonData().isShiny());
  const imageURL = () => {
    if (isShiny()) {
      return `/api/pokemon-images/${id()}s.png`;
    }
    return `/api/pokemon-images/${id()}.png`;
  };

  const blockClickCascade = (event) => event.stopPropagation();

  const pokemonMoves = () => pokemonData()
    .getMoveIds()
    .map((id) => moveList()
      .find((m) => Number(m.id) === Number(id)));

  const [top, setTop] = createSignal(0);
  const [left, setLeft] = createSignal(0);

  onMount(() => {
    setLeft(imageRef.offsetLeft + (3 * imageRef.clientWidth) / 4);
    setTop(imageRef.offsetTop + (3 * imageRef.clientHeight) / 4);
  });

  return (
    <div
      id="backdrop"
      onClick={onClose}
      style={{
        "z-index": 1000,
        "background-color": 'rgba(0, 0, 0, 0.6)',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        "min-height": '100vh',
        "min-width": '100vw',
        position: 'absolute',
      }}
    >
      <dialog
        open
        onClick={blockClickCascade}
        class="border border-gray-400 border-solid mt-2 rounded-sm p-2 min-w-[70vw]"
        style={{
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          position: 'fixed',
          height: 'fit-content',
          "backdrop-filter": 'blur(10px)',
          "background-color": 'rgba(255, 255, 255, 0.6)',
        }}
      >
        <div
          onClick={blockClickCascade}
          class="mt-2 rounded-sm p-2"
          style={{
            height: 'fit-content',
          }}
        >
          <div class="w-full px-1 flex flex-col justify-between">
            <div class="flex flex-row justify-start gap-2">
              <div class="flex flex-col items-start gap-1">
                <div>
                  <div class="flex flex-row gap-2 items-end">
                    <div class="block">
                      <PokemonTextInput
                        id="nickname-input"
                        label="Nickname"
                        value={nickname}
                        onChange={(bytes) => {
                          console.log(bytes);
                          setNickname(bytes);
                        }}
                        class="w-32"
                      />
                    </div>
                  </div>
                </div>
                <div class="w-full flex justify-center">
                  <img
                    ref={imageRef}
                    class="sharp-pixels hover:cursor-pointer w-32 mt-2 pb-2"
                    src={imageURL()}
                  />
                  <Show when={itemCode() > 0}>
                    <img
                      class="sharp-pixels w-8"
                      src={`/items/${String(itemCode() + 1).padStart(3, '0')}.png`}
                      style={{
                        position: 'fixed',
                        left: `${left()}px`,
                        top: `${top()}px`,
                      }}
                    />
                  </Show>
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
                    options={() => {
                      console.log('rerender species list...');
                      return speciesList()
                        .toSorted((a, b) => a.pokedex_id - b.pokedex_id)
                        .map((species) => {
                          const label = `${String(species.pokedex_id).padStart(3, '0')} ${species.name}`;
                          const value = species.species_id;
                          return { label, value };
                        });
                    }}
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
                    id="item-input"
                    class="w-44"
                    label="Held Item"
                    selectedValue={() => itemCode()}
                    options={() => {
                      const items = itemList()
                        .map((item) => ({ value: item.id, label: item.name }))
                        .concat([{ value: 0, label: 'None' }])
                      return items.toSorted((a, b) => {
                        if (a.value === 0) {
                          return -1;
                        } else if (b.value === 0) {
                          return 1;
                        } else {
                          return String(a.label).localeCompare(b.label, 'en');
                        }
                      });
                    }}
                    onChange={(event) => setItemCode(Number(event.target.value))}
                  />
                </div>
              </div>
              <div class="pt-1 w-full">
                <ul id="tabs" class="flex gap-1">
                  <li
                    onClick={() => setTab("moves")}
                    class="bg-white px-2 font-bold hover:bg-gray-200 hover:cursor-pointer"
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
                    class="bg-white px-2 font-bold hover:bg-gray-200 hover:cursor-pointer"
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
                  <li
                    class="bg-white px-2 font-bold hover:bg-gray-200 hover:cursor-pointer"
                    onClick={() => setTab("misc")}
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
                    Misc.
                  </li>
                </ul>
                <div
                  class="bg-white border border-gray-400 border-solid flex flex-row justify-start grow h-full"
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
                          setPPUpCount={(nextValue) =>
                            setPPIncreases(ppIncreases().with(index(), nextValue))
                          }
                          onChange={(moveId) => pokemonData().setMove(index(), moveId)}
                        />)}
                      </For>
                    </div>
                  </Show>
                  <Show when={tab() === "stats"}>
                    <div>
                      <div class="pl-2 flex flex-row gap-2" id="stats">
                        <div class="pt-2">
                          <EvEditor evArray={evArray} setEvArray={setEvArray} />
                        </div>
                        <div class="pt-2">
                          <IvEditor ivArray={ivArray} setIvArray={setIvArray} />
                        </div>
                        <div class="pt-2">
                          <StatDisplay pokemonData={pokemonData} />
                        </div>
                      </div>
                      <div class="px-2 pb-2">
                        <div class="flex justify-start gap-2">
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
                              onChange={(event) => setNature(NATURES.findIndex((n) => n.name === event.target.value))}
                              selectedValue={() => nature().name}
                            />
                          </div>
                          <div>
                            <label class="font-bold block" for="experience-input">Experience</label>
                            <input
                              id="experience-input"
                              type="text"
                              class="px-1 py-1 rounded-sm border border-solid border-gray-400 focus:outline-2 focus:outline-solid focus:outline-emerald-400 w-36"
                              onInput={(event) => setExperience(event.target.value)}
                              value={experience()}
                            />
                          </div>
                          <div>
                            <Selector
                              options={() => Array(100).fill(0).map((_, i) => ({ value: i + 1, label: String(i + 1) }))}
                              id="level-input"
                              class="w-44"
                              label="Level"
                              onChange={(event) => setLevel(event.target.value)}
                              selectedValue={level}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Show>
                  <Show when={tab() === "misc"}>
                    <div class="pt-1 px-2 pb-2">
                      <Selector
                        id="pokeball-input"
                        label="Pokeball"
                        selectedValue={pokeballIndex}
                        onChange={(event) => {
                          setPokeballIndex(Number(event.target.value));
                        }}
                        options={() => itemList()
                          .filter((item) => Number(item.id) < 13)
                          .map((item) => ({
                            label: item.name,
                            value: Number(item.id),
                          }))}
                      />
                    </div>
                  </Show>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-row justify-center w-full my-1 pt-8 gap-3">
            <div class="hover:outline-1 hover:outline-white hover:outline-dashed hover:cursor-pointer rounded-sm">
              <div class="rounded-sm bg-white h-fit w-fit m-0.25">
                <button
                  class="font-bold text-white bg-red-400 hover:opacity-90 px-4 py-1 rounded-sm w-40"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClose();
                  }}>
                  Cancel
                </button>
              </div>
            </div>
            <div class="hover:outline-1 hover:outline-white hover:outline-dashed hover:cursor-pointer rounded-sm">
              <div class="rounded-sm bg-white h-fit w-fit m-0.25">
                <button
                  class="font-bold text-white bg-blue-400 hover:opacity-90 px-4 py-1 rounded-sm w-40"
                  onClick={(event) => {
                    const save = bits();
                    const pokemonRef = pokemonData();
                    pokemonRef.setEffortValues(evArray());
                    pokemonRef.setIndividualValues(ivArray());
                    pokemonRef.recomputeChecksum();

                    // serialize pokemon to binary
                    pokemonRef.save(save);

                    recomputeSaveChecksums(save);
                    setBits([...save]);
                    event.stopPropagation();
                    onClose();
                  }}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default PokemonEditorDialog;
