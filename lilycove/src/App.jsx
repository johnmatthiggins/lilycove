import styles from './App.module.css';
import { createEffect, createSignal, Show } from 'solid-js';

const ASCII_UPPER_CASE_A = 0x41;
const ASCII_LOWER_CASE_A = 0x61;
const ASCII_ZERO = 0x30;

const PKMN_UPPER_CASE_A = 0xbb;
const PKMN_LOWER_CASE_A = 0xd5;
const PKMN_LEFT_ARROW = 0xd5;
const PKMN_ZERO = 0xa1;
const PKMN_BANG = 0xab;

function convertPokemonCharToASCII(pokemonChar) {
  if (pokemonChar >= PKMN_UPPER_CASE_A && pokemonChar < PKMN_LOWER_CASE_A) {
    const charCode = ASCII_UPPER_CASE_A + (Number(pokemonChar) - PKMN_UPPER_CASE_A);
    return String.fromCharCode(Number(charCode));
  } else if (pokemonChar >= PKMN_LOWER_CASE_A && Number(pokemonChar) < PKMN_LEFT_ARROW) {
    const charCode = ASCII_LOWER_CASE_A + (Number(pokemonChar) - PKMN_LOWER_CASE_A);
    return String.fromCharCode(Number(charCode));
  } else if (pokemonChar >= PKMN_ZERO && pokemonChar < PKMN_BANG) {
    const charCode = ASCII_ZERO + (Number(pokemonChar) - PKMN_ZERO);
    return String.fromCharCode(Number(charCode));
  }
  return ' ';
}

function convertPokemonStrToASCII(pokemonByteStr) {
  // We need to spread the array because it is
  // probably a typed array...
  return [...pokemonByteStr]
    .map((byte) => {
      return convertPokemonCharToASCII(byte);
    }).join("");
}

function parseTrainerName(bytes) {
  return convertPokemonStrToASCII(bytes);
}

function bytesToNumber(byteArray) {
  let result = 0;
  for (let i = byteArray.length - 1; i >= 0; i--) {
    result = (result * 256) + byteArray[i];
  }

  return result;
}

function parseTrainerId(bytes) {
  return bytesToNumber(bytes);
}

const SAVE_B_OFFSET = 0x00E000;
const TRAINER_NAME_POSITION = 0x6000;

function App() {
  const [bits, setBits] = createSignal([]);
  const [trainerName, setTrainerName] = createSignal('');
  const [trainerId, setTrainerId] = createSignal('');
  const [trainerGender, setTrainerGender] = createSignal('?');

  createEffect(() => {
    const offsetA = TRAINER_NAME_POSITION;
    const offsetB = SAVE_B_OFFSET + TRAINER_NAME_POSITION;
    const trainerNameA = parseTrainerName(bits().slice(offsetA, offsetA + 7));
    const trainerNameB = parseTrainerName(bits().slice(offsetB, offsetB + 7));
    const newTrainerId = parseTrainerId(bits().slice(0x600a, 0x600c));

    let gender = 'M';
    if (bits[TRAINER_NAME_POSITION + 7] === 1) {
      gender = 'F';
    }

    setTrainerGender(gender)
    setTrainerName(trainerNameA.trim() || trainerNameB);
    setTrainerId(newTrainerId);
  });

  return (
    <div class="h-full justify-center">
      <div class="flex h-full justify-center items-center">
        <div class="rounded-lg bg-white p-2 shadow-md border border-solid border-slate-200">
          <h3 class="text-3xl font-bold text-center">Lilycove City</h3>
          <h2 class="text-md">A Generation III Hex Editor</h2>
          <img class="sharp-pixels" src="https://archives.bulbagarden.net/media/upload/7/70/Spr_3r_005.png" />
          <label class="flex justify-center">
            <span
              class="text-teal-400 hover:text-white text-lg px-2 py-1 border border-solid border-teal-400 hover:bg-teal-400 rounded-md hover:cursor-pointer transition"
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
                const bytes = await file.bytes();
                setBits(bytes);
              }} />
          </label>
          <Show when={bits().length}>
            <h3 class="text-2xl">Trainer Data</h3>
            <pre class="text-left whitespace-pre">Name: {trainerName()}</pre>
            <pre class="text-left whitespace-pre">ID: {trainerId()}</pre>
            <pre class="text-left whitespace-pre">Gender: {trainerGender()}</pre>
          </Show>
        </div>
      </div>
    </div>
  );
}

export default App;
