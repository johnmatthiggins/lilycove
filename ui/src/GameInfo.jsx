import { createMemo, createSignal, For } from 'solid-js';

import { findSectionAddresses, areChecksumsValid } from './utils/save.jsx';

// import GamePicture from './GamePicture';
import PokemonCard from './PokemonCard.jsx';

import { bytesToBase64 } from './utils/hex.jsx';
import BoxPokemon from './BoxPokemon.jsx';

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
  const minutes = String(bits[offset + 2]);
  return `${hours}:${minutes.padStart(2, '0')}`
}

function GameInfo({ bits }) {
  const [selectedBox, setSelectedBox] = createSignal(0);
  const isSaveValid = createMemo(() => areChecksumsValid(bits()));

  const sectionOffsets = createMemo(() => findSectionAddresses(bits()));
  const trainerInfoOffset = () => sectionOffsets()['trainer_info'];

  const boxNames = () => {
    let array = new Array(14).fill(0).map(
      (_, i) => ({ name: `Box ${i + 1}`, index: i })
    );
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

    let boxBuffers = [];
    for (let i = 0; i < boxOffsets.length; i += 1) {
      const boxStart = boxOffsets[i];
      boxBuffers.push({
        buffer: bits().slice(boxStart, boxStart + boxLength),
        indexes: Array(boxLength).fill(0).map((_, i) => i + boxStart),
      });
    }

    const pokemon = [[], [], [], [], [], [], [], [], [], [], [], [], [], []];

    let sectionIndex = 0;

    // offset within box section...
    let byteIndex = 0;
    let buffer = [];

    for (let i = 0; i < 420; i += 1) {
      for (let j = 0; j < boxPokemonSize; j += 1) {
        const nextByte = boxBuffers[sectionIndex].buffer[byteIndex];
        const nextByteAddr = boxBuffers[sectionIndex].indexes[byteIndex];

        buffer.push([nextByte, nextByteAddr]);

        if (byteIndex + 1 === boxLength) {
          sectionIndex += 1;
          byteIndex = 0;
        } else {
          byteIndex += 1;
        }
      }

      pokemon[Math.floor(i / 30)].push(
        new BoxPokemon(
          buffer.map(([b]) => b),
          buffer.map(([, b]) => b))
      );
      buffer = [];
    }

    return pokemon;
  };

  return (
    <div class="bg-white p-2 my-1 w-[50vw] mx-auto rounded-sm">
      <div class="flex flex-col justify-center">
        <div>
          <div>
            <div class="flex justify-between">
              <Show when={isSaveValid()} fallback={<h3 class="text-3xl">Save is not valid</h3>}>
                <h3 class="text-3xl">Save is valid</h3>
              </Show>
              <h3 class="text-3xl font-bold">PC Box {Number(selectedBox()) + 1}</h3>
              <select
                class="w-32 rounded-sm p-1 bg-white border border-solid border-slate-400"
                id="box-selector"
                onChange={(event) => setSelectedBox(event.target.value)}
              >
                <For each={boxNames()}>
                  {({ name, index }) => <option value={index}>{name}</option>}
                </For>
              </select>
            </div>
            <div class="flex flex-wrap justify-between w-full">
              <For each={boxPokemon()[selectedBox()]}>
                {(p) => <PokemonCard pokemon={() => p} />}
              </For>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex justify-center">
        <span
          class="px-6 py-1 w-40 text-lg text-emerald-400 border border-emerald-400 border-solid hover:cursor-pointer hover:text-white hover:bg-emerald-400 rounded-sm font-bold text-center"
          onClick={() => {
            const saveData = bits();
            if (trainerInfoOffset() >= 0xE000) {
              for (let i = 0; i < 0xE000; i += 1) {
                saveData[i] = saveData[0xE000 + i];
              }
            } else {
              for (let i = 0; i < 0xE000; i += 1) {
                saveData[0xE000 + i] = saveData[i];
              }
            }

            const bytes = new Uint8Array(bits());
            let b64 = bytesToBase64(bytes);
            const dataUrl = `data:application/octet-stream;base64,${b64}`;
            const anchor = document.createElement('a')
            anchor.href = dataUrl;
            anchor.download = '*.sav';
            anchor.style.display = 'none';
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
          }}
        >
          Export Save
        </span>
      </div>
    </div >
  );
}

export default GameInfo;
