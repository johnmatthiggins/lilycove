import { createMemo, createSignal } from 'solid-js';

import { findSectionAddresses } from './utils/save.jsx';

import GamePicture from './GamePicture';
import PokemonCard from './PokemonCard.jsx';

import { convertPokemonStrToASCII } from './utils/hex.jsx';
import { BoxPokemon } from './utils/pokemonDataStructure.jsx';

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
  const [selectedBox, setSelectedBox] = createSignal(0);

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

  const boxNames = () => {
    let array = new Array(14).fill(0).map((_, i) => {
      return ({ name: `Box ${i + 1}`, index: i });
    });
    return array;
  };

  const boxPokemon = () => {
    const firstBoxOffset = sectionOffsets()['pc_buffer_A'];
    const firstPokemonOffset = firstBoxOffset + 0x4;
    const boxPokemonSize = 0x50;

    const boxLength = 3968;

    const boxOffsets = [
      firstPokemonOffset,
      sectionOffsets()['pc_buffer_B'] + 4,
      sectionOffsets()['pc_buffer_C'] + 4,
      sectionOffsets()['pc_buffer_D'] + 4,
      sectionOffsets()['pc_buffer_E'] + 4,
      sectionOffsets()['pc_buffer_F'] + 4,
      sectionOffsets()['pc_buffer_G'] + 4,
      sectionOffsets()['pc_buffer_H'] + 4,
      sectionOffsets()['pc_buffer_I'] + 4,
    ];

    let contiguousBoxBuffer = [];
    for (let i = 0; i < boxOffsets.length; i += 1) {
      const boxStart = boxOffsets[i];
      const boxBuffer = bits().slice(boxStart, boxStart + boxLength);
      contiguousBoxBuffer = contiguousBoxBuffer.concat(boxBuffer);
    }

    const pokemonBuffer = contiguousBoxBuffer;
    const pokemon = [[], [], [], [], [], [], [], [], [], [], [], [], [], []];

    // Just get all the pokemon hehe...
    for (let i = 0; i < 420; i += 1) {
      const offset = i * boxPokemonSize;

      const newPokemonBits = pokemonBuffer.slice(offset, offset + boxPokemonSize);
      const newPokemon = new BoxPokemon(newPokemonBits);

      pokemon[Math.floor(i / 30)].push(newPokemon);
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
      <div class="flex justify-start gap-2">
        <section id="party-pokemon">
          <h3 class="text-3xl font-bold">Party</h3>
          <div class="flex">
            {partyPokemon().slice(0, 3).map((p) => <PokemonCard pokemon={p} />)}
          </div>
          <div class="flex">
            {partyPokemon().slice(3).map((p) => <PokemonCard pokemon={p} />)}
          </div>
        </section>
        <section id="trainer-data">
          <h3 class="text-3xl font-bold">Trainer Data</h3>
          <pre class="text-left whitespace-pre">Name: {trainerName()}</pre>
          <pre class="text-left whitespace-pre">ID NO: {trainerId()}</pre>
          <pre class="text-left whitespace-pre">Gender: {trainerGender()}</pre>
          <pre class="text-left whitespace-pre">Time Played: {gameTime()}</pre>
          <pre class="text-left whitespace-pre">Sound: <i>{soundType()}</i></pre>
          <pre class="text-left whitespace-pre">Text Speed: <i>{textSpeed()}</i></pre>
          <pre class="text-left whitespace-pre">Battle Style: <i>{battleStyle()}</i></pre>
        </section>

      </div>

      <div class="flex flex-col justify-center">
        <div>
          <div>
            <div class="flex justify-between">
              <h3 class="text-3xl font-bold">PC Box {Number(selectedBox()) + 1}</h3>
              <select
                class="w-32 rounded-sm p-1"
                id="box-selector"
                onChange={(event) => setSelectedBox(event.target.value)}
              >
                {boxNames().map(({ name, index }) => {
                  return <option value={index}>{name}</option>;
                })}
              </select>
            </div>
            <div class="flex flex-wrap">
              {boxPokemon()[selectedBox()].map((p) => {
                return <PokemonCard pokemon={p} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameInfo;
