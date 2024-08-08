import { createMemo } from 'solid-js';

import { findSectionAddresses } from './utils/save.jsx';

import GamePicture from './GamePicture';
import { convertPokemonStrToASCII } from './utils/hex.jsx';
import { BoxPokemon } from './utils/pokemonDataStructure.jsx';

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

const OPTIONS_OFFSET = 0x13;

function GameInfo({ bits }) {
  const sectionOffsets = createMemo(() => findSectionAddresses(bits()));
  const trainerInfoOffset = () => sectionOffsets()['trainer_info'];
  const trainerName = () => {
    const offset = trainerInfoOffset();
    const nameBits = bits().slice(offset, offset + 8);
    return convertPokemonStrToASCII(nameBits);
  };

  const trainerGender = () => {
    const offset = trainerInfoOffset() + 0x8;
    const genderBit = bits()[offset];
    if (genderBit) {
      return 'F';
    }
    return 'M';
  };

  const trainerId = () => {
    const offset = trainerInfoOffset() + 0xA;
    const idBits = bits().slice(offset, offset + 2).reverse();
    const id = (idBits[0] << 8) | idBits[1];
    return id;
  };
  const gameCode = () => getGameCode(trainerInfoOffset(), bits());
  const gameTime = () => getInGameTime(trainerInfoOffset(), bits());
  const soundType = () => {
    const soundOptionsOffset = 0x15;
    const offset = trainerInfoOffset() + OPTIONS_OFFSET + soundOptionsOffset;

    let soundType = 'Stereo';
    if (bits()[offset] & 0x1) {
      soundType = 'Mono';
    }
    return soundType;
  };

  const boxPokemon = () => {
    const firstBoxOffset = sectionOffsets()['pc_buffer_A'];
    const firstPokemonOffset = firstBoxOffset + 0x4;
    const boxPokemonSize = 0x50;

    const pokemonBuffer = bits().slice(firstPokemonOffset, firstPokemonOffset + 20 * boxPokemonSize);
    const pokemon = [];

    for (let i = 0; i < 20; i += 1) {
      const offset = i * 0x50;
      const newPokemonBits = pokemonBuffer.slice(offset, offset + boxPokemonSize);

      // if it's not all zeroes then try processing it...
      if (newPokemonBits.some((b) => b > 0)) {
        const newPokemon = new BoxPokemon(newPokemonBits);
        pokemon.push(newPokemon);
      }
    }

    return pokemon;
  };

  const textSpeed = () => {
    const textSpeedOffset = 0x14;
    const offset = trainerInfoOffset() + OPTIONS_OFFSET + textSpeedOffset;
    const textSpeedByte = bits()[offset] & 0x7;

    let textSpeed;
    if (textSpeedByte === 0x0) {
      textSpeed = 'Slow';
    } else if (textSpeedByte === 0x1) {
      textSpeed = 'Medium';
    } else {
      textSpeed = 'Fast';
    }
    return textSpeed;
  };

  const battleStyle = () => {
    const battleStyleOffset = 0x15;
    const offset = trainerInfoOffset() + OPTIONS_OFFSET + battleStyleOffset;
    const battleStyleByte = (bits()[offset] ^ 0x5) >> 1;
    if (battleStyleByte) {
      return 'Set';
    }
    return 'Switch';
  };
  boxPokemon().map((p) => {
    console.log('species id = ', p.getSpeciesId());
    console.log('evs = ', p.getEffortValues());
  });

  return (
    <div>
      <div class="flex justify-center">
        <GamePicture gameCode={gameCode} />
      </div>
      <h3 class="text-3xl font-bold">Trainer Data</h3>
      <pre class="text-left whitespace-pre">Name: {trainerName()}</pre>
      <pre class="text-left whitespace-pre">ID NO: {trainerId()}</pre>
      <pre class="text-left whitespace-pre">Gender: {trainerGender()}</pre>
      <pre class="text-left whitespace-pre">Time Played: {gameTime()}</pre>
      <pre class="text-left whitespace-pre">Sound: <i>{soundType()}</i></pre>
      <pre class="text-left whitespace-pre">Text Speed: <i>{textSpeed()}</i></pre>
      <pre class="text-left whitespace-pre">Battle Style: <i>{battleStyle()}</i></pre>
      <h3 class="text-3xl">Pokemon</h3>
      <div style={{ display: 'flex' }}>
        {boxPokemon().map((p) => {
          const id = String(p.getSpeciesId()).padStart(3, '0');
          return (
            <img class="sharp-pixels" src={`/pokemon_images/${id}.png`} />
          );
        })}
      </div>
    </div>
  );
}

export default GameInfo;
