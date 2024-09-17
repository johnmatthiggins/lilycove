import { itemList } from "./ItemList";

function ClickablePokeball({ value, onClick, selected }) {
  const imageURL = () => `/static/items/${String(value).padStart(3, '0')}.png`;
  const className = () => {
    if (selected()) {
      return 'w-8 rounded-full bg-green-400';
    }
    return 'w-8 rounded-full hover:bg-red-400';
  };
  return (
    <img class={className()} src={imageURL()} onClick={onClick} role="button" tabindex="0" />
  );
}

function PokeballSelector({ value, onChange }) {
  return (
    <div class="flex p-2 rounded-md border border-solid border-gray-400 bg-gray-200 justify-start gap-2">
      <For each={
        itemList()
          .map((item) => Number(item.id))
          .filter((id) => id < 13 && id > 1)
      }>
        {(itemCode) => (
          <ClickablePokeball selected={() => Number(value()) === (itemCode - 1)} value={itemCode} onClick={() => onChange(itemCode - 1)} />
        )}
      </For>
    </div>
  );
}

export default PokeballSelector;
