import { createMemo, createSignal, Show } from 'solid-js';

import { itemList } from './ItemList';
import { speciesList } from './PokemonList';

import PokemonType from './PokemonType';

function PokemonCard({ pokemon }) {
  let ref;
  const id = () => String(pokemon.getSpeciesId()).padStart(3, '0');
  const [open, setOpen] = createSignal(false);

  const itemName = () => {
    const item = itemList().find(({ id: itemId }) => pokemon.getItemCode() === Number(itemId));
    if (item) {
      return item.name;
    }
    return 'N/A';
  };

  const pokemonTypes = createMemo(() => {
    const targetId = pokemon.getSpeciesId();
    const species = speciesList().find(({ species_id }) => species_id === targetId);
    if (!species) {
      return ['???'];
    }
    if (species?.type1 === species?.type2) {
      return [species?.type1];
    }
    return [species?.type1, species?.type2];
  });

  const imageURL = () => {
    if (pokemon.isShiny()) {
      return `/api/pokemon-images/${id()}s.png`;
    }
    return `/api/pokemon-images/${id()}.png`;
  };

  return (
    <div class="w-32">
      <div
        ref={ref}
        class="min-w-1/8 rounded-md border border-solid border-slate-200 flex justify-center"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <img
          class="sharp-pixels hover:cursor-pointer w-[100px] p-[5px] transition"
          src={imageURL()}
        />
      </div>
      <p class="text-center flex gap-1 flex-between">
        {pokemon.getName()}
        <Show when={pokemon.isShiny()}>
          <img width={10} src="/star.svg" class="shiny-star" />
        </Show>
      </p>

      <div
        class="shadow-sm"
        style={{
          background: 'white',
          display: open() ? 'block' : 'none',
          position: 'fixed',
          top: '0vh',
          left: '0vw',
          width: '25vw',
        }}
      >
        <div class="flex flex-row">
          <div class="flex items-start">
            <img
              class="sharp-pixels hover:cursor-pointer w-[100px] p-[5px] transition"
              src={imageURL()}
            />
          </div>
          <div class="text-left">
            <h3 class="text-3xl font-bold">{pokemon.getName()}</h3>
            <div class="flex gap-1">
              {pokemonTypes().map((typeText) => {
                return (
                  <PokemonType typeName={typeText} />
                )
              })}
            </div>
            <h3 class="text-3xl font-bold">Nature: {pokemon.getNature()}</h3>
            <div class="flex flex-row gap-1">
              <div>
                <h3 class="text-2xl font-bold">EVs</h3>
                <h3 class="text-xl">HP: {pokemon.getEffortValues().HP}</h3>
                <h3 class="text-xl">Attack: {pokemon.getEffortValues().Attack}</h3>
                <h3 class="text-xl">Defense: {pokemon.getEffortValues().Defense}</h3>
                <h3 class="text-xl">Speed: {pokemon.getEffortValues().Speed}</h3>
                <h3 class="text-xl">SpAtk.: {pokemon.getEffortValues()["Special Attack"]}</h3>
                <h3 class="text-xl">SpDef.: {pokemon.getEffortValues()["Special Defense"]}</h3>
              </div>
              <div>
                <h3 class="text-2xl font-bold">IVs</h3>
                <h3 class="text-xl">HP: {pokemon.getIndividualValues().hp}</h3>
                <h3 class="text-xl">Attack: {pokemon.getIndividualValues().attack}</h3>
                <h3 class="text-xl">Defense: {pokemon.getIndividualValues().defense}</h3>
                <h3 class="text-xl">Speed: {pokemon.getIndividualValues().speed}</h3>
                <h3 class="text-xl">SpAtk.: {pokemon.getIndividualValues().specialAttack}</h3>
                <h3 class="text-xl">SpDef.: {pokemon.getIndividualValues().specialDefense}</h3>
              </div>
            </div>
            <br />
            <h3 class="text-xl">Item: {itemName()}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
