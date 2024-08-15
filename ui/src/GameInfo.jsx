import { createMemo, createEffect } from 'solid-js';

import { itemList } from './ItemList.jsx';
import { findSectionAddresses } from './utils/save.jsx';

import GamePicture from './GamePicture';
import PokemonCard from './PokemonCard.jsx';

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
  const bytes = bits
    .slice(gameCodePosition, gameCodePosition + 4)
    .map((b) => BigInt(b));
  const [b0, b1, b2, b3] = bytes;
  const code = b0 | b1 >> 8n | b2 >> 16n | b3 >> 24n;

  return code;
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

  // Wow I managed to f up the bit alignment on this one...
  const trainerId = () => {
    const offset = trainerInfoOffset() + 0xA;
    const idBits = bits().slice(offset, offset + 2);
    const [b0, b1] = idBits;
    const id = (b1 << 8) | b0;
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

    const boxOffsets = [
      firstPokemonOffset,
      sectionOffsets()['pc_buffer_B'],
      sectionOffsets()['pc_buffer_C'],
      sectionOffsets()['pc_buffer_D'],
      sectionOffsets()['pc_buffer_E'],
      sectionOffsets()['pc_buffer_F'],
      sectionOffsets()['pc_buffer_G'],
      sectionOffsets()['pc_buffer_H'],
      sectionOffsets()['pc_buffer_I'],
    ];

    const pokemonBuffer = bits();
    const pokemon = [];

    for (let i = 0; i < boxOffsets.length; i += 1) {
      pokemon.push([]);
      for (let j = 0; j < 30; j += 1) {
        const offset = boxOffsets[i] + j * boxPokemonSize;
        const newPokemonBits = pokemonBuffer.slice(offset, offset + boxPokemonSize);
        const newPokemon = new BoxPokemon(newPokemonBits);

        pokemon[i].push(newPokemon);
      }
    }

    return pokemon;
  };

  const partyPokemon = () => {
    const teamSectionOffset = sectionOffsets()['team_and_items'];
    const code = getGameCode(trainerInfoOffset(), bits());

    let firstPokemonOffset;
    if (code === 0x1) {
      firstPokemonOffset = teamSectionOffset + 0x038;
    } else {
      firstPokemonOffset = teamSectionOffset + 0x238;
    }
    const partyPokemon = [];

    for (let i = 0; i < 6; i += 1) {
      const start = firstPokemonOffset + i * 100;
      const end = firstPokemonOffset + (i + 1) * 100;

      const pokemon = new BoxPokemon(bits().slice(start, end));

      partyPokemon.push(pokemon)
    }

    return partyPokemon;
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
      <section>
        <h3 class="text-3xl font-bold">Party</h3>
        {partyPokemon().map((p) => <PokemonCard pokemon={p} />)}
      </section>
      <h3 class="text-3xl font-bold">PC Box 1</h3>
      <div class="flex gap-1 flex-wrap">
        {boxPokemon().map((box) => box.map((p) => {
          if (p.hasSpecies()) {
            return <PokemonCard pokemon={p} />;
          }
          return (
            <div class="min-w-1/8 rounded-md border border-solid border-slate-200">
              <img
                class="sharp-pixels hover:cursor-pointer w-[100px] p-[5px] transition"
                src={`/pokemon_images/201.png`}
              />
              <p class="text-center">[Empty Space]</p>
            </div>
          )
        }))}
      </div>
    </div>
  );
}

export default GameInfo;
