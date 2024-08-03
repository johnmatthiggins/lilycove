import { createEffect, createSignal, Show } from 'solid-js';

const ASCII_UPPER_CASE_A = 0x41;
const ASCII_LOWER_CASE_A = 0x61;
const ASCII_ZERO = 0x30;

const PKMN_UPPER_CASE_A = 0xbb;
const PKMN_LOWER_CASE_A = 0xd5;
const PKMN_LEFT_ARROW = 0xd5;
const PKMN_ZERO = 0xa1;
const PKMN_BANG = 0xab;

function getSaveOffset(bits) {
  let saveOffset = SAVE_B_OFFSET;
  const [indexA, indexB] = getGreatestSaveIndex(bits);
  if (indexA > indexB) {
    saveOffset = 0x0;
  }
  return saveOffset;
}

function getGameCode(saveOffset, bits) {
  const gameCodePosition = saveOffset + 0xAC;
  const bytes = bits.slice(gameCodePosition, gameCodePosition + 4);
  return new Uint32Array(bytes)[0];
}

function getInGameTime(saveOffset, bits) {
  const offset = saveOffset + 0xE;
  const hours = new Uint16Array([bits[offset], bits[offset + 1]])[0];
  const minutes = bits[offset + 2];
  return `${hours}:${minutes}`
}

function getGameTitle(bits) {
  const saveOffset = getSaveOffset(bits);
  const gameCode = getGameCode(saveOffset, bits);

  let title;
  if (gameCode === 0x0) {
    title = "Pokemon Ruby or Pokemon Sapphire";
  } else if (gameCode == 0x1) {
    title = "Pokemon Fire Red or Pokemon Leaf Green";
  } else {
    title = "Pokemon Emerald";
  }
  return title;
}

function getGreatestSaveIndex(bits) {
  const SAVE_INDEX_A_POSITION = 0x0FFC;
  const SAVE_INDEX_B_POSITION = 0xEFFC;
  const saveIndexA = bits.slice(SAVE_INDEX_A_POSITION, SAVE_INDEX_A_POSITION + 1);
  const saveIndexB = bits.slice(SAVE_INDEX_B_POSITION, SAVE_INDEX_B_POSITION + 1);
  return [new Uint32Array(saveIndexA)[0], new Uint32Array(saveIndexB)[0]];
}

function parsePokemonBuffer(buffer) {
  const otIdOffset = 0x4;
  const nicknameOffset = 0x8;
  const otId = new Uint32Array(buffer.slice(otIdOffset, otIdOffset + 2));

  const nickname = convertPokemonStrToASCII(
    buffer.slice(nicknameOffset, nicknameOffset + 10)
  );
  return {
    nickname,
    otId,
  };
}

function getPokemonInParty(saveOffset, bits) {
  const teamSectionOffset = saveOffset + 0xF2C;
  const teamCountBytes = bits.slice(teamSectionOffset + 0x234, teamSectionOffset + 0x238);
  const teamCount = new Uint32Array(teamCountBytes)[0];

  let currentOffset = teamSectionOffset + 0x4;

  const pokemon = [];

  for (let i = 0; i < teamCount; i += 1) {
    currentOffset = (teamSectionOffset + 0x4) + (100 * i);
    const nextPokemon = parsePokemonBuffer(bits.slice(currentOffset, currentOffset + 100));
    pokemon.push(nextPokemon);
  }

  return pokemon;
}

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

const SAVE_B_OFFSET = 0x005000;
const TRAINER_NAME_POSITION = 0x0;

function App() {
  const [bits, setBits] = createSignal([]);
  const [gameTitle, setGameTitle] = createSignal('N/A');
  const [trainerName, setTrainerName] = createSignal('N/A');
  const [gameTime, setGameTime] = createSignal('N/A');
  const [trainerId, setTrainerId] = createSignal('N/A');
  const [trainerGender, setTrainerGender] = createSignal('N/A');

  createEffect(() => {
    const saveOffset = getSaveOffset(bits());

    const newTrainerName = parseTrainerName(bits().slice(saveOffset, saveOffset + 7));
    setTrainerName(newTrainerName.trim());

    const newTrainerId = parseTrainerId(bits().slice(saveOffset + 0xA, saveOffset + 0xA + 0x2));

    let gender = 'M';
    if (bits()[saveOffset + TRAINER_NAME_POSITION + 8] === 1) {
      gender = 'F';
    }

    const pokemon = getPokemonInParty(saveOffset, bits());

    setGameTime(getInGameTime(saveOffset, bits()));
    setGameTitle(getGameTitle(bits()));
    setTrainerGender(gender)
    setTrainerId(newTrainerId);
  });

  return (
    <div class="flex h-full w-full justify-center">
      <div class="grow justify-center items-center">
        <div class="rounded-lg bg-white p-2 shadow-md border border-solid border-slate-200 w-1/2 mx-auto">
          <h3 class="text-3xl font-bold text-center">Lilycove City</h3>
          <h2 class="text-md text-center">A Generation III Hex Editor</h2>
          <Show when={bits().length}>
            <pre class="text-left">Game: {gameTitle}</pre>
            <h3 class="text-2xl">Trainer Data</h3>
            <pre class="text-left whitespace-pre">Name: {trainerName()}</pre>
            <pre class="text-left whitespace-pre">ID: {trainerId()}</pre>
            <pre class="text-left whitespace-pre">Gender: {trainerGender()}</pre>
            <pre class="text-left whitespace-pre">Time Played: {gameTime()}</pre>
          </Show>
          <label class="flex justify-center">
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
                const bytes = await file.bytes();
                setBits(bytes);
              }} />
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
