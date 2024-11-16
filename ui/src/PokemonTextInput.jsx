import { createSignal, onMount } from "solid-js";
import PokemonTextChar from "./PokemonTextChar";

const START_CHAR_RANGE = 0xA0;

// non inclusive
const END_CHAR_RANGE = 0xEF;

/* A text input that handles Pokemon's proprietary text format */
function PokemonTextInput({
  id,
  label,
  value,
  onChange,
  "class": className = '',
}) {
  const truncated = () => {
    const firstDelimiter = value().indexOf(0xff);
    if (firstDelimiter === -1) {
      return value();
    }
    return value().slice(0, firstDelimiter);
  };

  const [focused, setFocused] = createSignal(false);
  let ref;

  const [top, setTop] = createSignal();
  const [left, setLeft] = createSignal();

  onMount(() => {
    setLeft(ref.offsetLeft);
    setTop(ref.offsetTop + ref.offsetHeight);
  });

  const cellSymbols = () => {
    const range = Array(END_CHAR_RANGE - START_CHAR_RANGE)
      .fill(0)
      .map((_, i) => i + START_CHAR_RANGE);

    const cells = Array(6).fill(0).map((_) => []);

    for (let i = 0; i < cells.length; i += 1) {
      for (let j = 0; j < range.length / 5; j += 1) {
        cells[i].push(range[i * 0xF + j]);
      }
    }
    return cells;
  };

  return (
    <>
      <label class="font-bold block" for={id}>{label}</label>
      <span
        id={id}
        ref={ref}
        tabindex="0"
        onClick={() => setFocused(true)}
        style={{
          "outline-width": focused() ? '0.125em' : undefined,
          "outline-color": focused() ? 'black' : undefined,
          "outline-style": focused() ? 'solid' : undefined,
        }}
        class={"flex items-center shadow-inner bg-white hover:cursor-pointer px-1 min-h-9 rounded-md border border-solid border-gray-400 hover:outline hover:outline-2 hover:outline-solid hover:outline-black " + className}
      >
        <For each={truncated()}>
          {(byte) => <PokemonTextChar byte={byte} />}
        </For>
      </span>
      <Show when={focused()}>
        <div
          id="backdrop"
          onClick={() => setFocused(false)}
          style={{
            overflow: "hidden",
            "z-index": 1000,
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            position: 'fixed',
          }}>
          <dialog
            open
            class="bg-white border border-gray-200 border-solid rounded-sm"
            onClick={(event) => event.stopPropagation()}
            style={{
              "z-index": 800000,
              position: "fixed",
              left: `${left()}px`,
              bottom: '0px',
            }}
          >
            <div class="flex w-full justify-end">
              <button
                class="w-8 h-auto hover:cursor-pointer hover:bg-gray-200 text-center rounded-full m-0.5 text-lg font-bold active:bg-gray-400"
                onClick={(event) => {
                  setFocused(false)
                  event.stopPropagation();
                }}
              >
                &times;
              </button>
            </div>
            <table class="font-mono m-1">
              <For each={cellSymbols()}>
                {(row) => (<tr>
                  <For each={row}>
                    {(cell) => (
                      <td
                      >
                        <button
                          class="px-1 select-none hover:cursor-pointer hover:bg-gray-200 w-12 h-8 text-center rounded-sm active:bg-gray-400"
                          onClick={(event) => {
                            event.stopPropagation();
                            onChange(truncated().concat([cell]));
                          }}
                        >
                          <PokemonTextChar byte={cell} />
                        </button>
                      </td>
                    )}
                  </For>
                </tr>)}
              </For>
            </table>
            <div class="flex gap-1 px-1 justify-between pb-2 pt-1">
              <button
                class="rounded-sm bg-gray-200 px-2 hover:bg-gray-400"
                onClick={(event) => {
                  event.stopPropagation();
                  setFocused(false);
                }}
              >
                Ok
              </button>
              <button
                class="rounded-sm bg-gray-200 px-2 hover:bg-gray-400"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange(truncated().concat(0x0));
                }}
              >
                Space
              </button>
              <button
                class="rounded-sm bg-gray-200 px-2 hover:bg-gray-400"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange(truncated().slice(0, truncated().length - 1));
                }}
              >
                Delete
              </button>
            </div>
          </dialog>
        </div>
      </Show>
    </>
  );
}

export default PokemonTextInput;
