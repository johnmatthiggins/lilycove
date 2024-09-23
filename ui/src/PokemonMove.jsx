import { createMemo, createSignal, Show } from "solid-js";
import PPCounter from "./PPCounter";
import PokemonType from "./PokemonType";

import { moveList } from "./MoveList";
import { hiddenPowerPower, hiddenPowerType } from "./utils/pokemonDataStructure";
import MoveAutocomplete from "./MoveAutocomplete";

function PokemonMove({
  pokemonData,
  moveId,
  ppUpCount,
  setPPUpCount,
  onChange,
}) {
  const [currentMoveId, setCurrentMoveId] = createSignal(moveId);
  const moveData = createMemo(
    () => moveList().find((m) => m.id === currentMoveId())
  );
  const description = () => moveData()?.effect || '(Empty move slots have no effects in battle.)';
  const power = () => {
    if (moveData()?.name === 'Hidden Power') {
      const ivs = pokemonData().getIndividualValues();
      const ivArray = [
        ivs.hp,
        ivs.attack,
        ivs.defense,
        ivs.speed,
        ivs.specialAttack,
        ivs.specialDefense,
      ];
      return hiddenPowerPower(...ivArray);
    }
    return moveData()?.power || '--';
  };
  const accuracy = () => moveData()?.accuracy || '--';
  const powerPoints = () => moveData()?.pp || 0;
  const adjustedPowerPoints = () => {
    const result = powerPoints() + (ppUpCount() * (powerPoints() / 5))
    return result;
  };
  const moveType = () => {
    if (moveData()) {
      if (moveData().name !== "Hidden Power") {
        return moveData().move_type;
      } else {
        const ivs = pokemonData().getIndividualValues();
        const ivArray = [
          ivs.hp,
          ivs.attack,
          ivs.defense,
          ivs.speed,
          ivs.specialAttack,
          ivs.specialDefense,
        ];
        return hiddenPowerType(...ivArray);
      }
    } else {
      return '???';
    }
  };

  const handleMoveChange = (newId) => {
    if (onChange) {
      onChange(newId);
    }
    setCurrentMoveId(newId);
  };

  return (
    <div class="p-1 w-full bg-white">
      <div class="flex flex-row items-center justify-between text-md pb-1">
        <div class="flex flex-row items-center justify-start">
          <PokemonType typeName={moveType} />
          <div class="w-fit hover:outline hover:outline-2 hover:outline-solid hover:outline-black rounded-md focus:outline focus:outline-2 focus:outline-solid focus:outline-black">
            <MoveAutocomplete
              id={`move-autocomplete-${moveId}`}
              label=""
              options={moveList}
              selectedValue={currentMoveId}
              onChange={handleMoveChange}
              pokemonData={pokemonData}
            />
          </div>
        </div>
        <div class="w-fit flex flex-row justify-end border border-solid border-gray-400 rounded-md">
          <table class="border-1 border-solid border-gray-400 h-8">
            <thead>
              <tr>
                <td class="px-1 w-16 text-center">
                  <Show when={Number(power())} fallback={"--"}>
                    <div class="flex gap-2 pl-2">
                      <p>{power()}</p>
                      <img class="w-4" src="/static/fist.svg" />
                    </div>
                  </Show>
                </td>
                <td class="px-1 w-14 text-center">
                  <Show when={Number(accuracy())} fallback={"--"}>
                    {accuracy()}%
                  </Show>
                </td>
                <td class="px-1 w-14 text-center">
                  {adjustedPowerPoints()}/{adjustedPowerPoints()}
                </td>
              </tr>
            </thead>
          </table>
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
