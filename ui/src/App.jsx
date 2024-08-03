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


function trainerIdToBuffer(trainerId) {
  const lsb = trainerId & 0xff;
  const msb = trainerId >> 8;

  return [lsb, msb];
}

function trainerNameToBuffer(trainerName) {
  let utf8Encode = new TextEncoder();
  let nameBuffer = [...utf8Encode.encode(trainerName)];

  if (nameBuffer.length < 8) {
    const diff = 8 - nameBuffer.length;
    const padding = new Array(diff).map((_) => 0xff);
    nameBuffer = nameBuffer.concat(padding);
  }
  return nameBuffer.map((b) => {
    return convertASCIICodeToPokemonCharCode(b);
  });
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

  const handleNameChange = (event) => setTrainerName(event.target.value);
  const handleIdChange = (event) => setTrainerId(event.target.value);

  const trainerNameBuffer = () => trainerNameToBuffer(trainerName());
  const trainerIdBuffer = () => trainerIdToBuffer(trainerId());

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

  return (
    <div class="flex h-full w-full justify-center">
      <div class="grow justify-center items-center">
        <div class="rounded-lg bg-white p-2 shadow-md border border-solid border-slate-200 w-1/2 mx-auto">
          <h3 class="text-3xl font-bold text-center">Lilycove City</h3>
          <h2 class="text-md text-center">A Generation III Hex Editor</h2>
          <p class="text-center">Enter trainer name and trainer ID and we can parse your save data!</p>
          <div class="my-2">
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
              class="font-mono block rounded-md border border-solid border-slate-200 p-1"
              tabIndex="0"
              onKeyUp={handleNameChange}
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
              type="number"
              class="font-mono block rounded-md border border-solid border-slate-200 p-1"
              min="1"
              max="65535"
              tabIndex="0"
              onKeyUp={handleIdChange}
            />
            <Show when={trainerId()}>
              <div class="font-mono bg-slate-200 w-fit px-2 mt-1 rounded-full">
                {trainerIdBufferText()}
              </div>
            </Show>
          </div>
          <Show when={bits().length}>
            <GameInfo bits={bits} />
          </Show>
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
                const bytes = await bytesFromFile(file);
                setBits(bytes);
              }} />
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
