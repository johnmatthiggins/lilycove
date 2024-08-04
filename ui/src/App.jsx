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

async function bytesFromFile(file) {
  let array = [];
  for await (const chunk of file.stream()) {
    array = array.concat([...chunk]);
  }
  return array;
}

function App() {
  const [bits, setBits] = createSignal([]);

  const [trainerName, setTrainerName] = createSignal('');
  const [trainerId, setTrainerId] = createSignal('');
  const [trainerGender, setTrainerGender] = createSignal(0);

  const handleNameChange = (event) => setTrainerName(event.target.value);
  const handleIdChange = (event) => setTrainerId(event.target.value);
  const handleGenderChange = (event) => setTrainerGender(event.target.value);

  const trainerNameBuffer = () => {
    let utf8Encode = new TextEncoder();
    let nameBuffer = [...utf8Encode.encode(trainerName())];

    if (nameBuffer.length < 8) {
      const diff = 8 - nameBuffer.length;
      const padding = new Array(diff);
      for (let i = 0; i < diff; i += 1) {
        padding[i] = 0xff;
      }
      nameBuffer = nameBuffer.concat(padding);
    }
    return nameBuffer.map((b) => {
      return convertASCIICodeToPokemonCharCode(b);
    });
  };

  const trainerIdBuffer = () => {
    const lsb = trainerId() & 0xff;
    const msb = trainerId() >> 8;

    return [lsb, msb];
  };

  const trainerGenderBuffer = () => [0, trainerGender()];

  const bufferToText =
    (buffer) => buffer.map((b) => {
      let hex = b.toString(16);
      if (hex.length < 2) {
        hex = '0' + hex;
      }
      return hex;
    }).join(' ');

  const trainerNameBufferText = () => bufferToText(trainerNameBuffer());
  const trainerIdBufferText = () => bufferToText(trainerIdBuffer());

  const searchBytes = () => {
    return trainerNameBuffer()
      .concat(
        trainerGenderBuffer(),
        trainerIdBuffer()
      );
  };

  return (
    <div class="flex h-full w-full justify-center">
      <div class="grow justify-center items-center">
        <div class="rounded-lg bg-white p-2 shadow-md border border-solid border-slate-200 w-1/2 mx-auto">
          <h3 class="text-3xl font-bold text-center">Lilycove City</h3>
          <h2 class="text-md text-center">A Generation III Hex Editor</h2>
          <Show when={bits().length === 0}>
            <p class="text-center">Enter trainer name and trainer ID and we can parse your save data!</p>
            <div class="my-2">
              <div class="w-fit mb-1">
                <label
                  for="trainer-name-input"
                  class="font-bold"
                >
                  Trainer Name
                </label>
                <input
                  name="trainer-name-input"
                  id="trainer-name-input"
                  type="text"
                  class="font-mono block rounded-md border border-solid border-slate-200 p-1 w-full"
                  maxlength="7"
                  tabIndex="0"
                  onInput={handleNameChange}
                />
                <Show when={trainerName().length > 0}>
                  <div class="font-mono bg-slate-200 w-fit px-2 mt-1 rounded-full">
                    {trainerNameBufferText()}
                  </div>
                </Show>
                <label
                  for="trainer-id-input"
                  class="font-bold"
                >
                  Trainer ID
                </label>
                <input
                  id="trainer-id-input"
                  type="text"
                  pattern="\d*"
                  class="font-mono block rounded-md border border-solid border-slate-200 p-1 w-full"
                  inputmode="numeric"
                  tabIndex="0"
                  onInput={handleIdChange}
                />
                <Show when={trainerId()}>
                  <div class="font-mono bg-slate-200 w-fit px-2 mt-1 rounded-full">
                    {trainerIdBufferText()}
                  </div>
                </Show>
                <label for="trainer-gender-input" class="font-bold">Trainer Gender</label>
                <select
                  id="trainer-id-input"
                  class="block rounded-md border border-solid border-slate-200 bg-white p-2 w-full"
                  tabIndex="0"
                  onInput={handleGenderChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <div class="font-mono px-1">{bufferToText(searchBytes())}</div>
              </div>
              <label class="flex justify-center w-fit">
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
        </div>
        <Show when={bits().length}>
          <GameInfo
            bits={bits}
            searchBytes={searchBytes}
          />
        </Show>
      </div>
    </div>
  );
}

export default App;
