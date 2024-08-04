import { createMemo, createSignal } from 'solid-js';
import GamePicture from './GamePicture';

const ASCII_UPPER_CASE_A = 0x41;
const ASCII_LOWER_CASE_A = 0x61;
const ASCII_ZERO = 0x30;

const PKMN_UPPER_CASE_A = 0xbb;
const PKMN_LOWER_CASE_A = 0xd5;
const PKMN_LEFT_ARROW = 0xd5;
const PKMN_ZERO = 0xa1;
const PKMN_BANG = 0xab;

const TRAINER_NAME_POSITION = 0x0;

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
        if (j > 0) {
          console.log(`missed at i = ${i}`);
        }
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

function getGameTitle(gameCode) {
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
  console.log(saveOffset);
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

function GameInfo({ bits, searchBytes }) {
  const [gameTitle, setGameTitle] = createSignal('N/A');
  const [gameTime, setGameTime] = createSignal('N/A');

  const saveOffset = () => getSaveOffset(bits(), searchBytes());

  const gameCode = () => getGameCode(saveOffset(), bits());

  setGameTime(getInGameTime(saveOffset(), bits()));
  setGameTitle(getGameTitle(gameCode()));

  return (
    <div>
      <GamePicture gameCode={gameCode} />
      <h3 class="text-2xl">Trainer Data</h3>
      <pre class="text-left whitespace-pre">Time Played: {gameTime()}</pre>
    </div>
  )
}

export default GameInfo;
