import { createMemo, createSignal, Show } from "solid-js";
import PokemonType from "./PokemonType";

import { moveList } from "./MoveList";

function PokemonMove({
  moveId,
  pp,
}) {
  const [ppValue, setPPValue] = createSignal(pp);

  const [currentMoveId, setCurrentMoveId] = createSignal(moveId);
  const moveData = createMemo(() => {
    const selected = moveList().find((m) => m.id === currentMoveId());
    return selected;
  });

  const description = () => moveData().effect;
  const power = () => moveData().power;
  const accuracy = () => moveData().accuracy;
  const moveType = () => moveData().move_type;

  const handleMoveChange = (event) => {
    const newId = event.target.value;
    setCurrentMoveId(newId);
  };

  return (
    <div class="border border-solid border-slate-200 p-1 w-full rounded-md bg-white">
      <div class="flex flex-row items-center justify-between">
        <PokemonType typeName={moveType} />
        <select
          value={currentMoveId()}
          onChange={handleMoveChange}
          class="bg-white focus:border-white border border-solid border-slate-200 rounded-sm focus:outline focus:outline-solid focus:outline-green-400 p-1"
        >
          <For each={moveList().toSorted((a, b) => a.name.localeCompare(b.name, 'en'))}>
            {(move, _) => {
              return (
                <option value={move.id}>{move.name}</option>
              );
            }}
          </For>
        </select>
        <div class="w-fit flex flex-row justify-end bg-slate-200 border border-solid border-slate-400 rounded-sm">
          <span class="border border-solid border-slate-400 px-1">
            <Show when={Number(power())} fallback={"-"}>
              {power()} &#x26A1;
            </Show>
          </span>
          <span class="border border-solid border-slate-400 px-1">
            <Show when={Number(accuracy())} fallback={"-"}>
              {accuracy()}%
            </Show>
          </span>
          <span class="border border-solid border-slate-400 px-1">{ppValue()}/{ppValue()}</span>
        </div>
      </div>
      <p class="text-sm">{description()}</p>
    </div>
  );
}

export default PokemonMove;
