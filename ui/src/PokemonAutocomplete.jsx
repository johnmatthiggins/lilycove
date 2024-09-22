import { createSignal, createEffect, Show } from 'solid-js';
import { distance } from './JaroWinkler';
import LazyImage from './LazyImage';
import PokemonType from './PokemonType';

function PokemonOption({ option, onClick }) {
  const paddedPokedexId = () => String(option().pokedex_id).padStart('3', 0);
  return (
    <button
      tabindex={0}
      class="border border-gray-400 border-solid rounded-md text-gray-700 px-1 hover:cursor-pointer hover:outline hover:outline-2 hover:outline-solid hover:outline-black focus:outline-black focus:outline focus:outline-2 focus:outline-solid"
      onClick={onClick}
      onKeyUp={(event) => {
        if (event.key.toLowerCase() === 'enter') {
          onChange(option.species_id);
          setFocused(false);
          setText('');
        }
      }}
    >
      <div class="flex flex-row justify-start gap-1">
        <div class="w-16 h-16 p-1">
          <LazyImage src={() => `/static/pokemon-images/${paddedPokedexId()}.png`} />
        </div>
        <div>
          <h1 class="text-left text-lg font-bold">{option().name} #{paddedPokedexId()}</h1>
          <div class="flex gap-1">
            <For each={(() => {
              if (option()?.type1 === option()?.type2) {
                return [option()?.type1];
              }
              return [option()?.type1, option()?.type2];
            })()}>
              {(typeText) => (<PokemonType typeName={() => typeText} />)}
            </For>
          </div>
        </div>
      </div>
    </button>
  )
}

function PokemonAutocomplete({
  id,
  label,
  options,
  selectedValue,
  onChange,
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
    const selectedOption = options().find((option) => option.species_id === selectedValue());
    return selectedOption?.name || '';
  };

  const topFiveOptions = () => {
    if (!text()) {
      return options().slice(0, 5);
    }
    const rankedOptions = options().map((option) => ({
      rank: distance(option.name, text()),
      ...option,
    })).toSorted((a, b) => b.rank - a.rank);

    return rankedOptions.slice(0, 5);
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
          <p>{selectedLabel()}</p><img src="/static/search.svg" class="w-4" />
        </span>
      </div>
      <Show when={focused()}>
        <div
          id="search-input-backdrop"
          class="flex justify-center items-center"
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
            class="bg-white rounded-md flex justify-center min-w-[18rem] border border-gray-400 border-solid p-2 flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <input
              class="bg-white border border-gray-400 border-solid rounded-md min-h-9 px-2"
              value={text()}
              ref={setRef}
              onKeyUp={(event) => {
                if (event.key.toLowerCase() === 'enter') {
                  onChange(topFiveOptions()[0].species_id);
                  setFocused(false);
                  setText('');
                }
              }}
              onInput={(event) => setText(event.target.value)}
            />
            <div class="flex flex-col gap-2 pt-2">
              <For each={topFiveOptions()}>
                {(option) => (
                  <PokemonOption
                    option={() => option}
                    onClick={() => {
                      onChange(option.species_id);
                      setFocused(false);
                      setText('');
                    }}
                  />
                )}
              </For>
            </div>
          </div>
        </div>
      </Show >
    </>
  );
}

export default PokemonAutocomplete;
