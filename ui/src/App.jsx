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

  const fetchSave = async () => {
    fetch('/static/test.sav')
      .then(async (response) => {
        const buffer = await response.bytes();
        const bytes = Array.from(new Uint8Array(buffer));
        setBits(bytes);
      });
  };

  return (
    <div
      class="flex h-full w-full justify-center sharp-pixel min-h-[100vh] items-center"
      style={{
        'background-image': 'url("/static/backdrop.png")',
        'background-repeat': 'repeat',
        'background-size': '100vw auto',
        'image-rendering': 'pixelated',
        'background-attachment': 'fixed',
      }}
    >
      <div class="grow justify-center items-center w-full">
        <Show when={bits().length === 0}>
          <div class="rounded-lg px-1 pb-1 w-1/2 mx-auto">
            <h3
              class="font-bold text-center text-white min-h-36"
              style={{
                'font-size': '8rem',
                'font-family': 'Space Grotesk',
                'text-shadow': '0.0625em 0.0625em rgba(0,0,0,0.2)',
              }}
            >
              Lilycove
            </h3>
            <h2
              class="text-center text-white text-2xl font-bold"
              style={{
                'text-shadow': '0.0625em 0.0625em rgba(0,0,0,0.2)',
                'font-family': 'Space Grotesk',
              }}
            >
              A Save Editor for Generation III Pok&#233;mon Games
            </h2>
            <div class="mt-2 mb-4 mx-auto w-fit rounded-md" style={{ "background-color": "black" }}>
              <label class="flex justify-center rounded-md w-fit bg-black">
                <span
                  class="text-black font-bold text-lg text-center w-44 py-1 bg-white rounded-md shadow-sm hover:shadow-lg hover:cursor-pointer border-2 border-solid border-gray-200 hover:outline hover:outline-2 hover:outline-solid hover:outline-black"
                  role="button"
                >
                  Upload Your Save
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
            <div class="mt-2 mb-4 mx-auto w-fit rounded-md" style={{ "background-color": "black" }}>
              <button
                class="text-black font-bold text-lg text-center w-44 py-1 bg-white rounded-md shadow-sm hover:shadow-lg hover:cursor-pointer border-2 border-solid border-gray-200 hover:outline hover:outline-2 hover:outline-solid hover:outline-black"
                onClick={fetchSave}
              >
                Use a Test Save
              </button>
            </div>
          </div>
        </Show>
        <Show when={bits().length}>
          <GameInfo
            bits={bits}
          />
        </Show>
      </div >
    </div >
  );
}

export default App;
