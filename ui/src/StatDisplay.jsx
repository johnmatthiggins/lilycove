function StatDisplay({ pokemonData }) {
  const effortValues = () => pokemonData().getEffortValues();
  const individualValues = () => pokemonData().getIndividualValues();

  return (
    <div>
      <h3 class="text-2xl font-bold">Stats</h3>
      <div class="flex flex-row gap-2">
        <section class="flex flex-col gap-1">
          <div class="h-8 flex items-center">
            <label for="hp-stat" class="font-bold h-8 text-center">HP</label>
          </div>
          <div class="h-8 flex items-center">
            <label for="atk-stat" class="font-bold h-8 text-center">Atk</label>
          </div>
          <div class="h-8 flex items-center">
            <label for="def-stat" class="font-bold h-8 text-center">Def</label>
          </div>
          <div class="h-8 flex items-center">
            <label for="spa-stat" class="font-bold h-8 text-center">SpA</label>
          </div>
          <div class="h-8 flex items-center">
            <label for="spd-stat" class="font-bold h-8 text-center">SpD</label>
          </div>
          <div class="h-8 flex items-center">
            <label for="spe-stat" class="font-bold h-8 text-center">Spe</label>
          </div>
        </section>
        <section class="flex flex-col gap-1">
          <input disabled id="hp-stat" class="w-12 border border-solid border-gray-400 px-1 h-8" />
          <input disabled id="atk-stat" class="w-12 border border-solid border-gray-400 px-1 h-8" />
          <input disabled id="def-stat" class="w-12 border border-solid border-gray-400 px-1 h-8" />
          <input disabled id="spa-stat" class="w-12 border border-solid border-gray-400 px-1 h-8" />
          <input disabled id="spd-stat" class="w-12 border border-solid border-gray-400 px-1 h-8" />
          <input disabled id="spe-stat" class="w-12 border border-solid border-gray-400 px-1 h-8" />
        </section>
      </div>
    </div>
  );
}

export default StatDisplay;
