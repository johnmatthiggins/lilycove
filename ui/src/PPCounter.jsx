function PPCounter({
  ppUpCount,
  setPPUpCount,
}) {
  const increment = () => setPPUpCount(Math.min(ppUpCount() + 1, 3));
  const decrement = () => setPPUpCount(Math.max(ppUpCount() - 1, 0));

  return (
    <div class="font-mono flex justify-between pl-2 select-none gap-2">
      <span
        class="bg-gray-200 rounded-sm min-w-5 text-center hover:cursor-pointer hover:opacity-80 hover:outline-1 hover:outline-black hover:outline-dotted"
        onClick={decrement}
      >
        {'-'}
      </span>
      <span>{ppUpCount()}</span>
      <span class="h-1.5 rounded-sm">
        <Show when={ppUpCount() === 3} fallback={<img class="sharp-pixels" src="/items/068.png" />}>
          <img class="sharp-pixels" src="/items/070.png" />
        </Show>
      </span>
      <span
        class="bg-gray-200 rounded-sm min-w-5 text-center hover:cursor-pointer hover:opacity-80 hover:outline-1 hover:outline-black hover:outline-dotted"
        onClick={increment}>
        {'+'}
      </span>
    </div>
  );
}

export default PPCounter;
