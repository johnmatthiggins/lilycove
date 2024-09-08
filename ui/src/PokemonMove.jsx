import { createMemo, createSignal, Show } from "solid-js";
import PPCounter from "./PPCounter";
import PokemonType from "./PokemonType";

import { moveList } from "./MoveList";

function PokemonMove({
  moveId,
  ppUpCount,
  setPPUpCount,
  onChange,
}) {
  const [currentMoveId, setCurrentMoveId] = createSignal(moveId);
  const moveData = createMemo(() => {
    const selected = moveList().find((m) => m.id === currentMoveId());
    return selected;
  });

  const description = () => moveData()?.effect || '(Empty move slots have no effects in battle.)';
  const power = () => moveData()?.power || '--';
  const accuracy = () => moveData()?.accuracy || '--';
  const powerPoints = () => moveData()?.pp || 0;
  const adjustedPowerPoints = () => {
    const result = powerPoints() + (ppUpCount() * (powerPoints() / 5))
    return result;
  };
  const moveType = () => moveData()?.move_type || '???';

  const handleMoveChange = (event) => {
    const newId = event.target.value;
    if (onChange) {
      onChange(newId);
    }
    setCurrentMoveId(newId);
  };

  return (
    <div class="p-1 w-full rounded-sm bg-white">
      <div class="flex flex-row items-center justify-between text-md">
        <div class="flex flex-row items-center justify-start">
          <PokemonType typeName={moveType} />
          <select
            value={currentMoveId()}
            onChange={handleMoveChange}
            class="bg-white focus:border-white border border-solid border-gray-400 rounded-sm focus:outline-2 focus:outline-solid focus:outline-emerald-400 p-1"
          >
            <option value="-1">----------</option>
            <For each={moveList().toSorted((a, b) => a.name.localeCompare(b.name, 'en'))}>
              {(move, _) => {
                return (
                  <option value={move.id}>{move.name}</option>
                );
              }}
            </For>
          </select>
        </div>
        <div class="w-fit flex flex-row justify-end border border-solid border-gray-400 rounded-sm">
          <span class="border border-solid border-gray-400 px-1 w-16 text-center">
            <Show when={Number(power())} fallback={"--"}>
              {power()} &#x26A1;
            </Show>
          </span>
          <span class="border border-solid border-gray-400 px-1 w-14 text-center">
            <Show when={Number(accuracy())} fallback={"--"}>
              {accuracy()}%
            </Show>
          </span>
          <span class="border border-solid border-gray-400 px-1 w-14 text-center">
            {adjustedPowerPoints()}/{adjustedPowerPoints()}
          </span>
        </div>
      </div>
      <div class="flex justify-between">
        <p class="text-md">{description()}</p>
        <PPCounter ppUpCount={ppUpCount} setPPUpCount={setPPUpCount} />
      </div>
    </div>
  );
}

export default PokemonMove;
