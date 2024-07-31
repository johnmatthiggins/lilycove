import styles from './App.module.css';
import { createSignal } from 'solid-js';

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
    const charCode = ASCII_UPPER_CASE_A + (pokemonChar - PKMN_UPPER_CASE_A);
    console.log(String.fromCharCode(charCode));
    return String.fromCharCode(charCode);
  } else if (pokemonChar >= PKMN_LOWER_CASE_A && pokemonChar < PKMN_LEFT_ARROW) {
    const charCode = ASCII_LOWER_CASE_A + (pokemonChar - PKMN_LOWER_CASE_A);
    console.log(String.fromCharCode(charCode));
    return String.fromCharCode(charCode);
  } else if (pokemonChar >= PKMN_ZERO && pokemonChar < PKMN_BANG) {
    const charCode = ASCII_ZERO + (pokemonChar - PKMN_BANG);
    console.log(String.fromCharCode(charCode));
    return String.fromCharCode(charCode);
  } else {
    return ' ';
  }
}

function convertPokemonStrToASCII(pokemonByteStr) {
  return pokemonByteStr
    .map((byte) => convertPokemonCharToASCII(byte))
    .join("");
}

function parseTrainerName(bytes) {
  console.log(bytes);
  return convertPokemonStrToASCII(bytes);
}

function App() {
  const [buffer, setBuffer] = createSignal([]);
  const [bits, setBits] = createSignal([]);

  const trainerName = () => {
    return parseTrainerName(bits().slice(0x6000, 0x6008));
  };

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <div class="rounded-lg bg-cyan-200 w-64">
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
          <pre class="text-left whitespace-pre">{trainerName()}</pre>
        </div>
      </header>
    </div>
  );
}

export default App;
