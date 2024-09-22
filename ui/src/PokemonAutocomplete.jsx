import { createSignal, createEffect, Show } from 'solid-js';
import { distance } from './JaroWinkler';
import LazyImage from './LazyImage';

function PokemonAutocomplete({
  id,
  label,
  options,
  selectedValue,
  onChange,
  'class': className = '',
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
    const selectedOption = options().find((option) => option.speciesId === selectedValue());
    return selectedOption?.label || '';
  };

  const topFiveOptions = () => {
    if (!text()) {
      return options().slice(0, 5);
    }
    const rankedOptions = options().map((option) => ({
      rank: distance(option.label, text()),
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
          class="px-2 rounded-md min-h-9 border border-gray-400 border-solid w-44 hover:outline hover:outline-2 hover:outline-solid hover:outline-black hover:cursor-pointer flex items-center justify-start"
        >
          {selectedLabel()}
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
            class="bg-white rounded-md flex justify-center w-96 border border-gray-400 border-solid p-2 flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <input
              class="bg-white border border-gray-400 border-solid rounded-md min-h-9 px-2"
              value={text()}
              ref={setRef}
              onKeyUp={(event) => {
                if (event.key.toLowerCase() === 'enter') {
                  onChange(topFiveOptions()[0].speciesId);
                  setFocused(false);
                  setText('');
                }
              }}
              onInput={(event) => setText(event.target.value)}
            />
            <div class="flex flex-col gap-2 pt-2">
              <For each={topFiveOptions()}>
                {(option, index) => (
                  <Show when={index() === 0} fallback={
                    <div
                      class="border border-gray-400 border-solid rounded-md text-gray-700 px-1 hover:cursor-pointer hover:outline hover:outline-2 hover:outline-solid hover:outline-black"
                      onClick={() => {
                        onChange(option.speciesId);
                        setFocused(false);
                        setText('');
                      }}
                    >
                      <div class="flex flex-row justify-start gap-1">
                        <div class="w-8 h-8 p-1">
                          <LazyImage src={() => `/static/pokemon-images/${String(option.pokedexId).padStart('3', 0)}.png`} />
                        </div>
                        <h1 class="text-lg">{option.label}</h1>
                      </div>
                    </div>
                  }>
                    <div
                      class="border border-gray-400 border-solid rounded-md text-gray-700 px-1 hover:cursor-pointer hover:outline-solid outline outline-2 outline-dashed outline-black"
                      onClick={() => {
                        onChange(option.speciesId);
                        setFocused(false);
                        setText('');
                      }}
                    >
                      <div class="flex flex-row justify-start gap-1">
                        <div class="w-8 h-8 p-1">
                          <LazyImage src={() => `/static/pokemon-images/${String(option.pokedexId).padStart('3', 0)}.png`} />
                        </div>
                        <h1 class="text-lg">{option.label}</h1>
                      </div>
                    </div>
                  </Show>
                )}
              </For>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}

export default PokemonAutocomplete;
