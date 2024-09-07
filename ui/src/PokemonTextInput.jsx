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
    return value().slice(0, firstDelimiter);
  };

  const [focused, setFocused] = createSignal(false);
  let ref;

  const [top, setTop] = createSignal();
  const [left, setLeft] = createSignal();

  onMount(() => {
    console.log(ref);
    setLeft(ref.offsetLeft);
    setTop(ref.offsetTop + ref.offsetHeight);
  });

  const cellSymbols = () => {
    const range = Array(END_CHAR_RANGE - START_CHAR_RANGE)
      .fill(0)
      .map((_, i) => i + START_CHAR_RANGE);

    const cells = Array(5).fill(0).map((_) => []);

    for (let i = 0; i < 5; i += 1) {
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
        tabindex={0}
        onClick={() => {
          setFocused(true)
        }}
        class={"flex bg-white hover:cursor-pointer px-1 py-1 min-h-9 rounded-sm border border-solid border-gray-400 " + className}
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
            class="bg-white border border-gray-200 border-solid"
            style={{
              "z-index": 800000,
              position: "fixed",
              top: `${top()}px`,
              left: `${left()}px`,
            }}
          >
            <div class="flex w-full justify-end">
              <div
                class="px-2 hover:cursor-pointer hover:bg-gray-200 text-center"
                role="button"
                onClick={(event) => {
                  setFocused(false)
                  event.stopPropagation();
                }}
              >
                &times;
              </div>
            </div>
            <table class="font-mono p-1">
              <For each={cellSymbols()}>
                {(row) => (<tr>
                  <For each={row}>
                    {(cell) => (
                      <td
                        class="px-1 select-none hover:cursor-pointer hover:bg-gray-200"
                        onClick={(event) => {
                          event.stopPropagation();
                          onChange(truncated().concat([cell]));
                        }}
                      >
                        <PokemonTextChar
                          byte={cell}
                        />
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
