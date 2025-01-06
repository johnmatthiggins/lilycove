import { createMemo, createSignal, For, Show } from 'solid-js';

import { findSectionAddresses, areChecksumsValid } from './utils/save.jsx';
import { byteArrayToBigInt, parseTrainerName } from './utils/hex.jsx';
import SaveButton from './SaveButton.jsx';
import PCBoxView from './PCBoxView.jsx';

function GameInfo({ bits }) {
  const [selectedBox, setSelectedBox] = createSignal(0);
  const isSaveValid = createMemo(() => areChecksumsValid(bits()));

  const sectionOffsets = createMemo(() => findSectionAddresses(bits()));
  const trainerInfoOffset = () => sectionOffsets()['trainer_info'];

  const boxNames = () => new Array(14).fill(0).map(
    (_, i) => ({ name: `Box ${i + 1}`, index: i })
  );
  const trainerName = () => {
    const offset = trainerInfoOffset();
    const trainerName = parseTrainerName(bits().slice(offset, offset + 7));
    return trainerName;
  };
  const trainerGender = () => {
    const offset = trainerInfoOffset() + 8;
    const isFemale = Boolean(bits()[offset]);
    return isFemale;
  };
  const trainerID = () => {
    const offset = trainerInfoOffset() + 0xA;
    const bytes = bits().slice(offset, offset + 4);
    const trainerId = byteArrayToBigInt(bytes);
    return trainerId;
  };
  return (
    <div class="bg-white p-2 my-1 mx-auto rounded-lg border border-gray-200 border-solid w-2/3">
      <div class="flex justify-between gap-2">
        <div class="grow border-2 border-gray-200 border-solid rounded-md py-1 px-2 mb-1 shadow-sm">
          <div class="">
            {/*
              Need to include:
              - trainer tab
                - money
                - gender
                - badges
              - item tab
                - configure which non-key items you have.
                - configure which key items you have.
            */}
            <h3 class="text-3xl font-bold text-gray-700">Trainer Info</h3>
            <div>
              <label class="text-lg text-gray-700 font-bold">
                Name -&nbsp;
              </label>
              <input class="text-lg text-gray-700" value={trainerName()}></input>
            </div>
            <div>
              <label class="text-lg text-gray-700 font-bold">
                Gender -&nbsp;
              </label>
              <Show when={!trainerGender()} fallback={
                <input class="text-lg" value="Female"></input>
              }>
                <input class="text-lg" value="Male"></input>
              </Show>
            </div>
            <div>
              <label class="text-lg text-gray-700 font-bold">
                Trainer ID -&nbsp;
              </label>
              <input class="text-lg" value={trainerID()}></input>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-center">
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
            <PCBoxView bits={bits} sectionOffsets={sectionOffsets} boxIndex={selectedBox} />
          </div>
        </div>
      </div>
      <div class="mt-1">
        <SaveButton bits={bits} trainerOffset={trainerInfoOffset} />
      </div>
    </div>
  );
}

export default GameInfo;
