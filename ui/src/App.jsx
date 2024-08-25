import { createEffect, createSignal, Show } from 'solid-js';

import { setItemList } from './ItemList';
import { setSpeciesList } from './PokemonList';
import { setMoveList } from './MoveList';
import GameInfo from './GameInfo';

function App() {
  const [bits, setBits] = createSignal([]);

  createEffect(() => {
    fetch('/api/items').then((response) => {
      return response.json();
    }).then((data) => {
      setItemList(data)
    });

    fetch('/api/species').then((response) => {
      return response.json();
    }).then((data) => {
      setSpeciesList(data);
    });

    fetch('/api/moves').then((response) => {
      return response.json();
    }).then((data) => {
      setMoveList(data);
    });
  });

  return (
    <div
      class="flex h-full w-full justify-center"
      style={{
        'background-image': 'url("public/backdrop.png")',
      }}>
      <div class="grow justify-center items-center">
        <div class="rounded-lg bg-white p-2 w-1/2 mx-auto">
          <h3 class="text-3xl font-bold text-center">Lilycove City</h3>
          <h2 class="text-md text-center">A Generation III Hex Editor</h2>
          <Show when={bits().length === 0}>
            <div class="my-2">
              <label class="flex justify-center w-full">
                <span
                  class="text-indigo-500 hover:text-white font-bold text-lg px-6 py-1 border border-solid border-indigo-500 hover:bg-indigo-500 rounded-sm hover:cursor-pointer"
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
                    let bytes = [];
                    for await (const chunk of file.stream()) {
                      bytes = bytes.concat([...chunk]);
                    }
                    setBits(bytes);
                  }} />
              </label>
            </div>
          </Show>
          <Show when={bits().length}>
            <GameInfo
              bits={bits}
            />
          </Show>
        </div>
      </div>
    </div>
  );
}

export default App;
