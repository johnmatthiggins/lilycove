import styles from './App.module.css';
import { createEffect, createSignal } from 'solid-js';

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
    console.log(String.fromCharCode(Number(charCode)));
    return String.fromCharCode(Number(charCode));
  } else if (pokemonChar >= PKMN_LOWER_CASE_A && Number(pokemonChar) < PKMN_LEFT_ARROW) {
    const charCode = ASCII_LOWER_CASE_A + (Number(pokemonChar) - PKMN_LOWER_CASE_A);
    console.log(String.fromCharCode(Number(charCode)));
    return String.fromCharCode(Number(charCode));
  } else if (pokemonChar >= PKMN_ZERO && pokemonChar < PKMN_BANG) {
    const charCode = ASCII_ZERO + (Number(pokemonChar) - PKMN_ZERO);
    console.log(String.fromCharCode(Number(charCode)));
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

function App() {
  const [bits, setBits] = createSignal([]);
  const [trainerName, setTrainerName] = createSignal('');
  const [trainerId, setTrainerId] = createSignal('');

  createEffect(() => {
    const newTrainerName = parseTrainerName(bits().slice(0x6000, 0x6008));
    const newTrainerId = parseTrainerId(bits().slice(0x600a, 0x600c));
    setTrainerName(newTrainerName);
    setTrainerId(newTrainerId);
  });

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <div class="rounded-lg bg-cyan-200 w-64 mx-auto">
          <h3 class="text-3xl">Lilycove City</h3>
          <h2 class="text-2xl">A Generation III Hex Editor</h2>
          <input
            type="file"
            accept=".sav"
            onChange={async (e) => {
              const file = e.target.files[0];
              const bytes = await file.bytes();
              setBits(bytes);
            }} />
          <pre class="text-left whitespace-pre">Trainer Name: {trainerName()}</pre>
          <pre class="text-left whitespace-pre">Trainer ID: {trainerId()}</pre>
        </div>
      </header>
    </div>
  );
}

export default App;
