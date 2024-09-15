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
        class="flex flex-col bg-white rounded-md w-24 h-24 border-2 border-solid border-gray-200 hover:border-emerald-400 p-2 m-1 shadow-sm hover:shadow-lg"
        onClick={handleClick}
      >
        <div
          ref={ref}
          class="flex justify-center grow hover:cursor-pointer p-1"
        >
          <Show when={pokemonData().hasSpecies()}>
            <LazyImage sharp src={imageURL} />
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
