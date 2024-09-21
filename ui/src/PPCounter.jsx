function PPCounter({
  ppUpCount,
  setPPUpCount,
}) {
  const increment = () => setPPUpCount(Math.min(ppUpCount() + 1, 3));
  const decrement = () => setPPUpCount(Math.max(ppUpCount() - 1, 0));

  return (
    <div class="font-mono flex justify-between pl-2 select-none gap-2">
      <Show when={ppUpCount() > 0} fallback={
        <button
          tabindex={0}
          class="rounded-md w-8 text-center hover:cursor-not-allowed shadow-sm border border-solid border-gray-400 bg-gray-200"
          onClick={decrement}>
          {'-'}
        </button>
      }>
        <button
          tabindex={0}
          class="bg-white rounded-md w-8 text-center shadow-sm border border-solid border-gray-400 hover:cursor-pointer"
          onClick={decrement}>
          {'-'}
        </button>
      </Show>
      <span>{ppUpCount()}</span>
      <span class="h-1.5 rounded-md">
        <Show when={ppUpCount() === 3} fallback={<img class="sharp-pixels" src="/static/items/068.png" />}>
          <img class="sharp-pixels" src="/static/items/070.png" />
        </Show>
      </span>
      <Show when={ppUpCount() < 3} fallback={
        <button
          tabindex={0}
          class="bg-gray-200 rounded-md w-8 text-center hover:cursor-not-allowed shadow-sm border border-solid border-gray-400"
          onClick={increment}>
          {'+'}
        </button>
      }>
        <span
          tabindex={0}
          class="bg-white rounded-md w-8 text-center shadow-sm border border-solid border-gray-400 hover:cursor-pointer"
          onClick={increment}>
          {'+'}
        </span>
      </Show>
    </div>
  );
}

export default PPCounter;
