import { createEffect, Show } from 'solid-js';

import { setItemList } from './ItemList';
import { setSpeciesList } from './PokemonList';
import { setMoveList } from './MoveList';
import { bits, setBits } from './fileBits';
import GameInfo from './GameInfo';

function App() {
  createEffect(() => {
    fetch('/api/items')
      .then((response) => response.json())
      .then((data) => {
        setItemList(data)
      });

    fetch('/api/species')
      .then((response) => response.json())
      .then((data) => {
        setSpeciesList(data);
      });

    fetch('/api/moves')
      .then((response) => response.json())
      .then((data) => {
        setMoveList(data);
      });
  });

  return (
    <div
      class="flex h-full w-full justify-center sharp-pixel min-h-[100vh] items-center"
      style={{
        'background-image': 'url("backdrop.png")',
        'background-size': '2000px',
        'image-rendering': 'pixelated',
        'background-attachment': 'fixed',
      }}
    >
      <div class="grow justify-center items-center w-full">
        <Show when={bits().length === 0}>
          <div class="rounded-lg p-2 w-1/2 mx-auto">
            <h3
              class="text-3xl font-bold text-center text-white min-h-36 font-pacifico"
              style={{ 'font-size': '8rem' }}
            >
              Lilycove
            </h3>
            <h2 class="font-pacifico text-center text-white text-2xl">A Pokemon Save Editor</h2>
            <div class="my-2 mx-auto w-fit rounded-md" style={{ "background-color": "black" }}>
              <label class="flex justify-center rounded-md w-fit bg-black">
                <span
                  class="text-black font-bold text-lg text-center w-40 py-1 bg-white rounded-md shadow-sm hover:shadow-lg hover:cursor-pointer border-2 border-solid border-gray-200"
                  role="button"
                >
                  Upload Save
                </span>
                <input
                  type="file"
                  accept=".sav"
                  class="hidden"
                  onChange={async (event) => {
                    const file = event.target.files[0];
                    let bytes = await file.arrayBuffer();
                    bytes = Array.from(new Uint8Array(bytes));
                    setBits(bytes);
                  }} />
              </label>
            </div>
          </div>
        </Show>
        <Show when={bits().length}>
          <GameInfo
            bits={bits}
          />
        </Show>
      </div>
    </div>
  );
}

export default App;
