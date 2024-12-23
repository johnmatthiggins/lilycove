import { createMemo, createSignal, For } from 'solid-js';

import { findSectionAddresses, areChecksumsValid } from './utils/save.jsx';
import Button from './Button';

// import GamePicture from './GamePicture';
import PokemonCard from './PokemonCard.jsx';

import { bytesToBase64 } from './utils/hex.jsx';
import BoxPokemon from './BoxPokemon.jsx';

function GameInfo({ bits }) {
  const [selectedBox, setSelectedBox] = createSignal(0);
  const isSaveValid = createMemo(() => areChecksumsValid(bits()));

  const sectionOffsets = createMemo(() => findSectionAddresses(bits()));
  const trainerInfoOffset = () => sectionOffsets()['trainer_info'];

  const boxNames = () => new Array(14).fill(0).map(
    (_, i) => ({ name: `Box ${i + 1}`, index: i })
  );

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
    <div
      class="bg-white p-2 my-1 w-fit mx-auto rounded-lg border border-gray-200 border-solid"
    >
      <div class="flex flex-col justify-center">
        <div>
          <div>
            <div class="flex justify-between pb-1">
              <select
                class="w-32 rounded-md bg-white border-2 border-solid border-gray-200 px-2 shadow-sm hover:cursor-pointer hover:outline hover:outline-2 hover:outline-solid hover:outline-black"
                id="box-selector"
                onChange={(event) => setSelectedBox(event.target.value)}
              >
                <For each={boxNames()}>
                  {({ name, index }) => <option value={index}>{name}</option>}
                </For>
              </select>
              <h3 class="text-3xl font-bold text-gray-700">PC Box {Number(selectedBox()) + 1}</h3>
              <Show when={isSaveValid()} fallback={<h3 class="text-3xl">&#x26A0;</h3>}>
                <h3 class="text-2xl w-32 text-right">&#x2714;</h3>
              </Show>
            </div>
            <div class="grid grid-cols-6 gap-1 justify-between w-full pb-1">
              <For each={boxPokemon()[selectedBox()]}>
                {(p) => <PokemonCard pokemon={() => p} />}
              </For>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex justify-center">
        <Button
          class="py-1 px-2 rounded-md text-md w-32"
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
          Download
        </Button>
      </div>
    </div>
  );
}

export default GameInfo;
