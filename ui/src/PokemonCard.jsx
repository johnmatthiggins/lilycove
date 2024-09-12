import { createSignal, Show } from 'solid-js';

import PokemonTextChar from './PokemonTextChar';
import PokemonEditorDialog from './PokemonEditorDialog';
import { speciesList } from './PokemonList';
import LazyImage from './LazyImage';

function PokemonCard({ pokemon }) {
  const [pokemonData, setPokemonData] = createSignal(pokemon());
  const speciesId = () => pokemonData().getSpeciesId();

  const speciesData = () => speciesList().find((p) => p.species_id === speciesId());
  const nickname = () => pokemonData().getNicknameBytes();
  const truncatedNickname = () => {
    const terminator = nickname().indexOf(0xff);
    if (terminator === -1) {
      return nickname();
    }
    return nickname().slice(0, terminator);
  };

  let ref;
  const pokedexId = () => String(speciesData()?.pokedex_id).padStart(3, '0');
  const [open, setOpen] = createSignal(false);

  const [isShiny, setIsShiny] = createSignal(pokemonData().isShiny());
  const imageURL = () => {
    if (!speciesData()) {
      // broken link IDK...
      return `/static/pokemon-images/0.png`;
    } else if (isShiny()) {
      return `/static/pokemon-images/${pokedexId()}s.png`;
    }
    return `/static/pokemon-images/${pokedexId()}.png`;
  };

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
            <LazyImage sharp src={imageURL} class="pt-[5px] px-[5px]" />
          </Show>
        </div>
        <div class="font-mono text-sm flex gap-1 justify-between px-1 items-center hover:cursor-pointer">
          <Show when={pokemonData().hasSpecies()}>
            <div class="flex text-sm">
              <For each={truncatedNickname()}>
                {(byte) => (<PokemonTextChar byte={byte} />)}
              </For>
            </div>
            <img src={`/static/items/${String(pokemonData().getPokeballItemId() + 1n).padStart(3, '0')}.png`} class="sharp-pixels w-5" />
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
