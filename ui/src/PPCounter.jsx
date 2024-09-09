function PPCounter({
  ppUpCount,
  setPPUpCount,
}) {
  const increment = () => setPPUpCount(Math.min(ppUpCount() + 1, 3));
  const decrement = () => setPPUpCount(Math.max(ppUpCount() - 1, 0));

  return (
    <div class="font-mono flex justify-between pl-2 select-none gap-2">
      <Show when={ppUpCount() > 0} fallback={
        <span
          class="bg-gray-200 rounded-sm min-w-5 text-center hover:cursor-not-allowed opacity-50"
          onClick={decrement}>
          {'-'}
        </span>
      }>
        <span
          class="bg-gray-200 rounded-sm min-w-5 text-center hover:cursor-pointer hover:opacity-80 hover:outline-1 hover:outline-black hover:outline-dotted"
          onClick={decrement}>
          {'-'}
        </span>
      </Show>
      <span>{ppUpCount()}</span>
      <span class="h-1.5 rounded-sm">
        <Show when={ppUpCount() === 3} fallback={<img class="sharp-pixels" src="/static/items/068.png" />}>
          <img class="sharp-pixels" src="/static/items/070.png" />
        </Show>
      </span>
      <Show when={ppUpCount() < 3} fallback={
        <span
          class="bg-gray-200 rounded-sm min-w-5 text-center hover:cursor-not-allowed opacity-50"
          onClick={increment}>
          {'+'}
        </span>
      }>
        <span
          class="bg-gray-200 rounded-sm min-w-5 text-center hover:cursor-pointer hover:opacity-80 hover:outline-1 hover:outline-black hover:outline-dotted"
          onClick={increment}>
          {'+'}
        </span>
      </Show>
    </div>
  );
}

export default PPCounter;
