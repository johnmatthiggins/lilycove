import PokemonType from "./PokemonType";

function PokemonMove({
  name,
  description,
  pp,
  moveType,
}) {
  return (
    <div class="border border-solid border-slate-200 p-1 w-full rounded-md">
      <div class="flex flex-row items-center justify-between">
        <h3 class="text-md font-bold">{name}</h3>
        <PokemonType typeName={moveType} />
      </div>
      <p class="text-sm">{description}</p>
      <div class="w-full flex flex-row justify-end">
        <p>{pp}/{pp}</p>
      </div>
    </div>
  );
}

export default PokemonMove;
