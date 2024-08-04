import { createMemo, createSignal } from 'solid-js';

const ASCII_UPPER_CASE_A = 0x41;
const ASCII_LOWER_CASE_A = 0x61;
const ASCII_ZERO = 0x30;

const PKMN_UPPER_CASE_A = 0xbb;
const PKMN_LOWER_CASE_A = 0xd5;
const PKMN_LEFT_ARROW = 0xd5;
const PKMN_ZERO = 0xa1;
const PKMN_BANG = 0xab;

const SAVE_B_OFFSET = 0x006000;
const TRAINER_NAME_POSITION = 0x0;

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

function detectSavePositions(bits, searchBytes) {
  const savePositions = [];
  for (let i = 0; i < bits.length; i += 1) {
    for (let j = 0; j < searchBytes.length; j += 1) {
      if (bits[i + j] === searchBytes[j]) {
        if (j === searchBytes.length - 1) {
          savePositions.push(i);

          if (savePositions.length === 2) {
            return savePositions;
          }
        }
      } else {
        break;
      }
    }
  }

  return savePositions;
}


function getSaveIndexes(bits, saveOffsets) {
  const saveIndexes = [];

  const SAVE_INDEX_OFFSET = 0x0FFC;

  for (let i = 0; i < saveOffsets.length; i += 1) {
    const saveIndex = bits.slice(
      saveOffsets[i] + SAVE_INDEX_OFFSET,
      saveOffsets[i] + SAVE_INDEX_OFFSET + 4);
    saveIndexes.push(new Uint32Array(saveIndex)[0]);
  }

  return saveIndexes;
}

function getSaveOffset(bits, searchBytes) {
  const saveOffsets = detectSavePositions(bits, searchBytes);
  const [indexA, indexB] = getSaveIndexes(bits, saveOffsets);
  if (indexA > indexB) {
    return saveOffsets[0];
  }
  return saveOffsets[1];
}

function getGameCode(saveOffset, bits) {
  const gameCodePosition = saveOffset + 0xAC;
  const bytes = bits.slice(gameCodePosition, gameCodePosition + 4);
  return new Uint32Array(bytes)[0];
}

function getGameTitle(bits, searchBytes) {
  const saveOffset = getSaveOffset(bits, searchBytes);
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


function getInGameTime(saveOffset, bits) {
  const offset = saveOffset + 0xE;
  const hours = new Uint16Array([bits[offset], bits[offset + 1]])[0];
  const minutes = bits[offset + 2];
  return `${hours}:${minutes}`
}


function convertPokemonStrToASCII(pokemonByteStr) {
  // We need to spread the array because it is
  // probably a typed array...
  return pokemonByteStr
    .slice()
    .map((byte) => {
      return convertPokemonCharToASCII(byte);
    }).join("");
}


function parseTrainerName(bytes) {
  return convertPokemonStrToASCII(bytes);
}

function GameInfo({ bits, searchBytes }) {
  const [gameTitle, setGameTitle] = createSignal('N/A');
  const [gameTime, setGameTime] = createSignal('N/A');
  const [trainerGender, setTrainerGender] = createSignal('N/A');

  const saveOffset = createMemo(() => getSaveOffset(bits(), searchBytes()));

  let gender = 'M';
  if (bits()[saveOffset() + TRAINER_NAME_POSITION + 8] === 1) {
    gender = 'F';
  }

  setGameTime(getInGameTime(saveOffset(), bits()));
  setGameTitle(getGameTitle(bits(), searchBytes()));
  setTrainerGender(gender)

  return (
    <div>
      <pre class="text-left">Game: {gameTitle}</pre>
      <h3 class="text-2xl">Trainer Data</h3>
      {/* <pre class="text-left whitespace-pre">Name: {trainerName}</pre>
      <pre class="text-left whitespace-pre">ID: {trainerId}</pre> */}
      <pre class="text-left whitespace-pre">Gender: {trainerGender()}</pre>
      <pre class="text-left whitespace-pre">Time Played: {gameTime()}</pre>
    </div>
  )
}

export default GameInfo;
