import { createSignal } from 'solid-js';

function PokemonCard({ pokemon }) {
  let ref;
  const id = String(pokemon.getSpeciesId()).padStart(3, '0');
  const [open, setOpen] = createSignal(false);

  return (
    <div>
      <div
        ref={ref}
        class="min-w-1/8 rounded-md border border-solid border-slate-200"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <img class="sharp-pixels hover:cursor-pointer w-[100px] p-[5px] transition" src={`/pokemon-images/${id}.png`} />
        <p class="text-center">{pokemon.getName()}</p>
      </div>

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
              src={`/pokemon-images/${id}.png`}
            />
          </div>
          <div class="text-left">
            <h3 class="text-3xl font-bold">{pokemon.getName()}</h3>
            <h3 class="text-3xl font-bold">Nature: {pokemon.getNature()}</h3>
            <hr />
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
