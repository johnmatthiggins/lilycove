import { createEffect, createSignal, Show } from 'solid-js';

import GameInfo from './GameInfo';

const ASCII_UPPER_A = 0x41;
const ASCII_UPPER_Z = ASCII_UPPER_A + 25;

const ASCII_LOWER_A = 0x61;
const ASCII_LOWER_Z = ASCII_LOWER_A + 25;

const ASCII_ZERO = 0x30;
const ASCII_NINE = ASCII_ZERO + 10;

const PKMN_UPPER_A = 0xbb;
const PKMN_LOWER_A = 0xd5;
const PKMN_ZERO = 0xa1;

function convertASCIICodeToPokemonCharCode(asciiChar) {
  if (asciiChar >= ASCII_UPPER_A && asciiChar < ASCII_LOWER_A) {
    const charCode = PKMN_UPPER_A + (Number(asciiChar) - ASCII_UPPER_A);
    return Number(charCode);
  } else if (
    asciiChar >= ASCII_LOWER_A
    && Number(asciiChar) <= ASCII_LOWER_Z
  ) {
    const charCode = PKMN_LOWER_A + (Number(asciiChar) - ASCII_LOWER_A);
    return Number(charCode);
  } else if (asciiChar >= ASCII_ZERO && asciiChar < ASCII_ZERO + 10) {
    const charCode = PKMN_ZERO + (Number(asciiChar) - ASCII_ZERO);
    return Number(charCode);
  }
  return 0xff;
}

function App() {
  const [bits, setBits] = createSignal([]);

  return (
    <div class="flex h-full w-full justify-center">
      <div class="grow justify-center items-center">
        <div class="rounded-lg bg-white p-2 shadow-md border border-solid border-slate-200 w-1/2 mx-auto">
          <h3 class="text-3xl font-bold text-center">Lilycove City</h3>
          <h2 class="text-md text-center">A Generation III Hex Editor</h2>
          <Show when={bits().length === 0}>
            <div class="my-2">
              <label class="flex justify-center w-full">
                <span
                  class="text-indigo-500 hover:text-white font-bold text-lg px-6 py-1 border border-solid border-indigo-500 hover:bg-indigo-500 rounded-full hover:cursor-pointer transition"
                  role="button"
                >
                  Upload Save
                </span>
                <input
                  type="file"
                  accept=".sav"
                  class="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    let bytes = [];
                    for await (const chunk of file.stream()) {
                      bytes = bytes.concat([...chunk]);
                    }
                    setBits(bytes);
                  }} />
              </label>
            </div>
          </Show>
          <Show when={bits().length}>
            <GameInfo
              bits={bits}
            />
          </Show>
        </div>
      </div>
    </div>
  );
}

export default App;
