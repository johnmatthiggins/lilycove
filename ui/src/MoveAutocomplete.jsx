import { createSignal, createEffect, Show } from 'solid-js';
import { distance } from './JaroWinkler';
import { hiddenPowerType, hiddenPowerPower } from './utils/pokemonDataStructure';
import PokemonType from './PokemonType';

function MoveOption({ option, onClick, pokemonData }) {
  const moveData = () => option;
  const description = () => moveData()?.effect || '(Empty move slots have no effects in battle.)';
  const accuracy = () => moveData()?.accuracy || '--';
  const powerPoints = () => moveData()?.pp || 0;
  const power = () => {
    if (moveData()?.name === 'Hidden Power') {
      const ivs = pokemonData().getIndividualValues();
      const ivArray = [
        ivs.hp,
        ivs.attack,
        ivs.defense,
        ivs.speed,
        ivs.specialAttack,
        ivs.specialDefense,
      ];
      return hiddenPowerPower(...ivArray);
    }
    return moveData()?.power || '--';
  };
  const moveType = () => {
    if (moveData()) {
      if (moveData().name !== "Hidden Power") {
        return moveData().move_type;
      } else {
        const ivs = pokemonData().getIndividualValues();
        const ivArray = [
          ivs.hp,
          ivs.attack,
          ivs.defense,
          ivs.speed,
          ivs.specialAttack,
          ivs.specialDefense,
        ];
        return hiddenPowerType(...ivArray);
      }
    } else {
      return '???';
    }
  };
  return (
    <button
      class="p-2 bg-white border border-gray-400 border-solid rounded-md min-w-[24rem] hover:outline hover:outline-2 hover:outline-black hover:outline-solid focus:outline focus:outline-2 focus:outline-black focus:outline-solid mx-1"
      onClick={onClick}
    >
      <div class="flex flex-row items-center justify-between text-md">
        <div class="flex flex-row items-center justify-start">
          <div class="flex items-center">
            <PokemonType typeName={moveType} />
          </div>
          <div class="w-fit flex items-center font-bold pr-2">
            {moveData().name}
          </div>
        </div>
        <div class="w-fit flex flex-row justify-end border border-solid border-gray-400 rounded-md">
          <table class="border-1 border-solid border-gray-400 h-8">
            <thead>
              <tr>
                <td class="px-1 w-16 text-center">
                  <Show when={Number(power())} fallback={"--"}>
                    <div class="flex gap-2 pl-2">
                      <p>{power()}</p>
                      <img class="w-4" src="/static/fist.svg" />
                    </div>
                  </Show>
                </td>
                <td class="px-1 w-14 text-center">
                  <Show when={Number(accuracy())} fallback={"--"}>
                    {accuracy()}%
                  </Show>
                </td>
                <td class="px-1 w-14 text-center">
                  {powerPoints()}/{powerPoints()}
                </td>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div class="flex justify-between">
        <p class="text-md">{description()}</p>
      </div>
    </button>
  )
}

function MoveAutocomplete({
  id,
  label,
  options,
  selectedValue,
  onChange,
  pokemonData,
}) {
  const [ref, setRef] = createSignal(null);
  const [text, setText] = createSignal('');
  const [focused, setFocused] = createSignal(false);

  createEffect(() => {
    if (ref() && focused()) {
      ref().focus();
    }
  });

  const selectedLabel = () => {
    const selectedOption = options().find((option) => Number(option.id) === Number(selectedValue()));
    return selectedOption?.name || '';
  };

  const rankedOptions = () => {
    if (!text()) {
      return options();
    }
    const rankedOptions = options()
      .map((option) => {
        const searchText = [option.move_type, option.name, option.effect];
        const scores = searchText.map((word) => distance(word, text()));
        return {
          rank: Math.max(...scores),
          ...option,
        };
      }
      ).toSorted((a, b) => b.rank - a.rank).slice(0, 50);

    return rankedOptions;
  };

  return (
    <>
      <div class="flex flex-col">
        <label for={id} class="text-gray-700 font-bold">
          {label}
        </label>
        <span
          onClick={() => setFocused(true)}
          tabindex={0}
          id={id}
          class="shadow-sm px-2 rounded-md min-h-9 border border-gray-400 border-solid w-44 hover:outline hover:outline-2 hover:outline-solid hover:outline-black hover:cursor-pointer flex items-center justify-between"
        >
          {selectedLabel()}
        </span>
      </div>
      <Show when={focused()}>
        <div
          id="search-input-backdrop"
          class="flex justify-center items-start"
          onClick={() => setFocused(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            "background-color": 'rgba(0,0,0,0.4)',
            "z-index": 10000,
          }}
        >
          <div
            class="bg-white rounded-md flex justify-center border border-gray-400 border-solid flex-col mt-32 mx-2"
            onClick={(event) => event.stopPropagation()}
          >
            <div class="flex flex-row w-full pb-2 border-b border-b-solid border-b-gray-400 px-2 pt-2">
              <input
                class="bg-white p-2 border border-gray-400 border-solid rounded-md min-h-9 w-full focus:outline focus:outline-2 focus:outline-black focus:outline-solid"
                value={text()}
                ref={setRef}
                onKeyUp={(event) => {
                  if (event.key.toLowerCase() === 'enter') {
                    onChange(rankedOptions()[0].id);
                    setFocused(false);
                    setText('');
                  }
                }}
                onInput={(event) => setText(event.target.value)}
              />
              <img src="/static/search.svg" class="w-4" style={{
                "margin-left": '-1.5rem',
              }} />
            </div>
            <div
              class="flex flex-col gap-2 py-2 mx-1"
              style={{ "overflow-y": "auto", "max-height": "70vh" }}
            >
              <For each={(() => rankedOptions())()}>
                {(option) => (
                  <MoveOption
                    pokemonData={pokemonData}
                    option={option}
                    onClick={() => {
                      onChange(option.id);
                      setFocused(false);
                      setText('');
                    }} />
                )}
              </For>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}

export default MoveAutocomplete;
