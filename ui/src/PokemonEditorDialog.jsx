import { createEffect, createMemo, createSignal, Show, Switch, Match } from 'solid-js';

import { hiddenPowerType } from './utils/pokemonDataStructure';
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
import LazyImage from './LazyImage';
import StatDisplay from './StatDisplay';
import Button from './Button';
import PokeballSelector from './PokeballSelector';

function PokemonEditorDialog({
  onClose,
  pokemonData,
  setPokemonData,
}) {
  const [tab, setTab] = createSignal('moves');
  const ivArray = () => {
    const ivs = pokemonData().getIndividualValues();
    return [
      ivs.hp,
      ivs.attack,
      ivs.defense,
      ivs.speed,
      ivs.specialAttack,
      ivs.specialDefense,
    ];
  };

  const setIvArray = (ivs) => {
    pokemonData().setIndividualValues(ivs);
    setPokemonData(pokemonData().copy());
  };

  const evArray = () => {
    const evs = pokemonData().getEffortValues();
    return [
      evs.hp,
      evs.attack,
      evs.defense,
      evs.speed,
      evs.specialAttack,
      evs.specialDefense,
    ];
  };

  const setEvArray = (evs) => {
    pokemonData().setEffortValues(evs);
    setPokemonData(pokemonData().copy());
  };

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
    setPokemonData(pokemonData().copy());
  };

  const pokeballIndex = () => Number(pokemonData().getPokeballItemId());
  const setPokeballIndex = (itemId) => {
    pokemonData().setPokeballWithItemId(itemId);
    setPokemonData(pokemonData().copy());
  };

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

  const [imageRef, setImageRef] = createSignal(null);
  const id = () => String(pokemonSpecies()?.pokedex_id).padStart(3, '0');

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
      return `/static/pokemon-images/${id()}s.png`;
    }
    return `/static/pokemon-images/${id()}.png`;
  };

  const blockClickCascade = (event) => event.stopPropagation();

  const pokemonMoves = () => pokemonData()
    .getMoveIds()
    .map((id) => moveList()
      .find((m) => Number(m.id) === Number(id)));

  const [top, setTop] = createSignal(0);
  const [left, setLeft] = createSignal(0);

  createEffect(() => {
    if (imageRef()) {
      const actualImageRef = imageRef();
      const { left: x, top: y, width, height } = actualImageRef.getBoundingClientRect();
      setLeft(x + (width / 2));
      setTop(y + (height / 2));
    }
  });

  return (
    <div
      id="backdrop"
      onClick={onClose}
      class="m-0"
      style={{
        "z-index": 1000,
        top: 0,
        left: 0,
        "height": '100vh',
        "width": '100vw',
        "backdrop-filter": 'blur(2px)',
        "background-color": 'rgba(0,0,0,0.1)',
        position: 'fixed',
      }}
    >
      <dialog
        open
        onClick={blockClickCascade}
        class="border border-gray-400 border-solid mt-2 rounded-md p-2 min-w-[55vw] h-fit"
      >
        <div
          onClick={blockClickCascade}
          class="mt-2 rounded-sm p-2"
          style={{
            height: 'fit-content',
            "background-color": 'rgba(255, 255, 255, 0.0)',
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
                        onChange={setNickname}
                        class="w-44"
                      />
                    </div>
                  </div>
                </div>
                <div class="w-full flex justify-center" ref={setImageRef}>
                  <LazyImage
                    sharp
                    class="hover:cursor-pointer w-32 mt-2 pb-2"
                    src={imageURL}
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
                    class="w-44 min-h-9"
                    label="Species"
                    onChange={(event) => setSpeciesId(Number(event.target.value))}
                    selectedValue={speciesId}
                    options={() => speciesList()
                      .toSorted((a, b) => a.pokedex_id - b.pokedex_id)
                      .map((species) => {
                        const label = `${species.name} #${String(species.pokedex_id).padStart(3, '0')}`;
                        const value = species.species_id;
                        return { label, value };
                      })}
                  />
                </div>
                <div>
                  <Selector
                    id="ability-input"
                    class="w-44 min-h-9"
                    label="Ability"
                    selectedValue={() => abilityIndex() % abilityList().length}
                    options={() => abilityList().map((ability, index) => ({ value: index, label: ability }))}
                    onChange={(event) => setAbilityIndex(Number(event.target.value))}
                  />
                </div>
                <div class="flex flex-row items-end gap-2">
                  <div>
                    <Selector
                      id="item-input"
                      class="w-32 min-h-9"
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
                  <div class="flex items-center min-h-9">
                    <Show when={itemCode() > 0}>
                      <img
                        class="sharp-pixels w-8"
                        src={`/static/items/${String(itemCode() + 1).padStart(3, '0')}.png`}
                      />
                    </Show>
                  </div>
                </div>
              </div>
              <div class="pt-1 w-full">
                <ul id="tabs" class="flex gap-1">
                  <li
                    onClick={() => setTab("moves")}
                    tabindex={0}
                    class="px-2 font-bold bg-gray-200 hover:bg-white hover:cursor-pointer w-20 text-center text-gray-700 transition"
                    style={{
                      'border-top-style': 'solid',
                      'border-left-style': 'solid',
                      'border-right-style': 'solid',
                      'border-top-width': '0.0625em',
                      'border-left-width': '0.0625em',
                      'border-right-width': '0.0625em',
                      'border-left-style': 'solid',
                      'border-right-style': 'solid',
                      'border-top-color': '#9ca3af',
                      'border-left-color': '#9ca3af',
                      'border-right-color': '#9ca3af',
                      'border-top-left-radius': '0.5em',
                      'border-top-right-radius': '0.5em',
                      'background-color': tab() === "moves" ? 'white' : undefined,
                      'margin-bottom': tab() === "moves" ? '-1px' : 0,
                    }}
                  >
                    Moves
                  </li>
                  <li
                    onClick={() => setTab("stats")}
                    tabindex={0}
                    class="px-2 font-bold bg-gray-200 hover:bg-white hover:cursor-pointer w-20 text-center text-gray-700 transition"
                    style={{
                      'border-top-style': 'solid',
                      'border-left-style': 'solid',
                      'border-right-style': 'solid',
                      'border-top-width': '0.0625em',
                      'border-left-width': '0.0625em',
                      'border-right-width': '0.0625em',
                      'border-left-style': 'solid',
                      'border-right-style': 'solid',
                      'border-top-color': '#9ca3af',
                      'border-left-color': '#9ca3af',
                      'border-right-color': '#9ca3af',
                      'border-top-left-radius': '0.5em',
                      'border-top-right-radius': '0.5em',
                      'background-color': tab() === "stats" ? 'white' : undefined,
                      'margin-bottom': tab() === "stats" ? '-1px' : 0,
                    }}
                  >
                    Stats
                  </li>
                  <li
                    onClick={() => setTab("misc")}
                    tabindex={0}
                    class="px-2 font-bold bg-gray-200 hover:bg-white hover:cursor-pointer w-20 text-center text-gray-700 transition"
                    style={{
                      'border-top-style': 'solid',
                      'border-left-style': 'solid',
                      'border-right-style': 'solid',
                      'border-top-width': '0.0625em',
                      'border-left-width': '0.0625em',
                      'border-right-width': '0.0625em',
                      'border-left-style': 'solid',
                      'border-right-style': 'solid',
                      'border-top-color': '#9ca3af',
                      'border-left-color': '#9ca3af',
                      'border-right-color': '#9ca3af',
                      'border-top-left-radius': '0.5em',
                      'border-top-right-radius': '0.5em',
                      'background-color': tab() === "misc" ? 'white' : undefined,
                      'margin-bottom': tab() === "misc" ? '-1px' : 0,
                    }}
                  >
                    Misc.
                  </li>
                </ul>
                <div
                  class="bg-white flex flex-row justify-start grow h-full border border-gray-400"
                  style={{
                    "border-bottom-right-radius": '0.5em',
                    "border-bottom-left-radius": '0.5em',
                    "border-top-right-radius": '0.5em',
                  }}
                >
                  <Switch>
                    <Match when={tab() === "moves"}>
                      <div class="flex flex-col gap-1 p-1 grow" id="moveset">
                        <For each={pokemonMoves()}>
                          {(move, index) => (
                            <PokemonMove
                              pokemonData={pokemonData}
                              moveId={move?.id || -1}
                              ppUpCount={() => ppIncreases()[index()]}
                              setPPUpCount={(nextValue) => setPPIncreases(ppIncreases().with(index(), nextValue))}
                              onChange={(moveId) => pokemonData().setMove(index(), moveId)}
                            />
                          )}
                        </For>
                      </div>
                    </Match>
                    <Match when={tab() === "stats"}>
                      <div>
                        <div class="pl-2 flex flex-row gap-2" id="stats">
                          <div class="pt-2">
                            <EvEditor evArray={evArray} setEvArray={setEvArray} />
                          </div>
                          <div class="pt-2">
                            <IvEditor ivArray={ivArray} setIvArray={setIvArray} />
                          </div>
                        </div>
                        <div class="px-2 flex flex-col gap-1">
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
                                class="w-44 min-h-9"
                                label="Nature"
                                onChange={(event) => setNature(NATURES.findIndex((n) => n.name === event.target.value))}
                                selectedValue={() => nature().name}
                              />
                            </div>
                            <div>
                              <label class="font-bold block text-gray-700" for="experience-input">
                                Experience
                              </label>
                              <input
                                id="experience-input"
                                type="text"
                                class="p-1 min-h-9 rounded-md border border-solid border-gray-400 focus:outline focus:outline-2 focus:outline-solid focus:outline-black hover:outline hover:outline-2 hover:outline-solid hover:outline-black w-20"
                                onInput={(event) => setExperience(event.target.value)}
                                value={experience()}
                              />
                            </div>
                            <div class="flex items-end gap-2">
                              <div>
                                <Selector
                                  options={() => Array(100).fill(0).map((_, i) => ({ value: i + 1, label: String(i + 1) }))}
                                  id="level-input"
                                  class="w-16 min-h-9"
                                  label="Level"
                                  onChange={(event) => setLevel(event.target.value)}
                                  selectedValue={level}
                                />
                              </div>
                              <button
                                class="bg-white text-black text-center hover:outline hover:outline-2 hover:outline-black hover:outline-solid border-2 border-2-solid border-2-gray-200 px-1 min-h-9 rounded-md hover:cursor-pointer hover:shadow-md shadow-sm font-bold"
                                onClick={() => setLevel(100)}
                              >
                                MAX
                              </button>
                            </div>
                          </div>
                          <div>
                            <label class="font-bold block text-gray-700">Hidden Power</label>
                            <div class="w-full flex">
                              <PokemonType fullWidth typeName={() => hiddenPowerType(...ivArray())} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Match>
                    <Match when={tab() === "misc"}>
                      <div class="pt-1 px-2 pb-2 flex gap-1 items-start">
                        <div class="flex flex-col justify-start">
                          <label class="font-bold block text-gray-700">Pokeball</label>
                          <PokeballSelector value={pokeballIndex} onChange={setPokeballIndex} />
                        </div>
                      </div>
                    </Match>
                  </Switch>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-row justify-center w-full my-1 pt-8 gap-3">
            <Button
              class="w-32 p-1 bg-white"
              onClick={(event) => {
                const save = bits();
                const pokemonRef = pokemonData();
                pokemonRef.recomputeChecksum();

                // serialize pokemon to binary
                pokemonRef.save(save);

                recomputeSaveChecksums(save);
                setBits([...save]);
                event.stopPropagation();
                onClose();
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default PokemonEditorDialog;
