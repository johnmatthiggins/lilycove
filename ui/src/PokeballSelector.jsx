import { itemList } from "./ItemList";

function ClickablePokeball({ value, onClick, selected }) {
  const imageURL = () => `/static/items/${String(value).padStart(3, '0')}.png`;
  const className = () => {
    if (selected()) {
      return 'h-8 w-8 rounded-full outline outline-2 outline-solid outline-black sharp-pixels drop-shadow-md';
    }
    return 'h-8 w-8 rounded-full focus:outline hover:outline focus:outline-2 hover:outline-2 focus:outline-dotted hover:outline-dotted focus:outline-black hover:outline-black sharp-pixels drop-shadow-md';
  };
  return (
    <img
      class={className()}
      src={imageURL()}
      onKeyUp={(event) => {
        if (event.code.toLowerCase() === 'enter') {
          onClick();
        }
      }}
      onClick={onClick}
      role="button"
      tabindex="0"
    />
  );
}

function PokeballSelector({ value, onChange }) {
  return (
    <div class="flex p-2 rounded-md border border-solid border-gray-400 justify-start gap-2">
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
