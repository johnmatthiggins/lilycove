import { createSignal, Show } from 'solid-js';

import PokemonTextChar from './PokemonTextChar';
import PokemonEditorDialog from './PokemonEditorDialog';

function PokemonCard({ pokemon }) {
  const [pokemonData, setPokemonData] = createSignal(pokemon());
  const speciesId = () => pokemonData().getSpeciesId();
  const nickname = () => pokemonData().getNicknameBytes();
  const truncatedNickname = () => {
    const firstZero = nickname().indexOf(0xff);
    return nickname().slice(0, firstZero);
  };

  let ref;
  const id = () => String(speciesId()).padStart(3, '0');
  const [open, setOpen] = createSignal(false);

  const [isShiny, setIsShiny] = createSignal(pokemonData().isShiny());
  const imageURL = () => {
    if (isShiny()) {
      return `/api/pokemon-images/${id()}s.png`;
    }
    return `/api/pokemon-images/${id()}.png`;
  };

  const handleClick = () => setOpen(true);
  const handleClose = () => {
    console.log('hello world');
    setOpen(false);
  };

  return (
    <>
      <div
        class="bg-white rounded-sm flex flex-col w-32 h-32 hover:bg-gray-400 border border-solid border-gray-400 p-1 m-1"
        onClick={handleClick}
      >
        <div
          ref={ref}
          class="min-w-1/8 border-gray-400 flex justify-center grow hover:cursor-pointer"
        >
          <Show when={pokemonData().hasSpecies()}>
            <img
              class="sharp-pixels pt-[5px] px-[5px]"
              src={imageURL()}
              loading="lazy"
            />
          </Show>
        </div>
        <div class="font-mono text-sm flex gap-1 justify-between px-1 items-center hover:cursor-pointer">
          <Show when={pokemonData().hasSpecies()}>
            <div class="flex text-sm">
              <For each={truncatedNickname()}>
                {(byte) => (<PokemonTextChar byte={byte} />)}
              </For>
            </div>
            <img src={`/items/${String(pokemonData().getPokeballItemId() + 1n).padStart(3, '0')}.png`} class="sharp-pixels w-5" />
          </Show>
        </div>
      </div>
      <Show when={open()}>
        <PokemonEditorDialog
          pokemonData={pokemonData}
          setPokemonData={setPokemonData}
          onClose={handleClose}
        />
      </Show>
    </>
  );
}

export default PokemonCard;
