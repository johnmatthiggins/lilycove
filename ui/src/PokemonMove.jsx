import { Show } from "solid-js";
import PokemonType from "./PokemonType";

function PokemonMove({
  name,
  description,
  power,
  accuracy,
  pp,
  moveType,
}) {
  return (
    <div class="border border-solid border-slate-200 p-1 w-full rounded-md bg-white">
      <div class="flex flex-row items-center justify-between">
        <PokemonType typeName={() => moveType} />
        <h3 class="text-md font-bold">{name}</h3>
        <div class="w-fit flex flex-row justify-end bg-slate-200 border border-solid border-slate-400 rounded-sm">
          <span class="border border-solid border-slate-400 px-1">
            <Show when={Number(power)} fallback={"-"}>
              {power} &#x26A1;
            </Show>
          </span>
          <span class="border border-solid border-slate-400 px-1">
            <Show when={Number(accuracy)} fallback={"-"}>
              {accuracy}%
            </Show>
          </span>
          <span class="border border-solid border-slate-400 px-1">{pp}/{pp}</span>
        </div>
      </div>
      <p class="text-sm">{description}</p>
    </div>
  );
}

export default PokemonMove;
