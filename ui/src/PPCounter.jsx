function PPCounter({
  ppUpCount,
  setPPUpCount,
}) {
  return (
    <div
      class="font-mono border border-solid border-gray-400 flex justify-between pl-2 select-none hover:bg-gray-400 hover:cursor-pointer"
      onClick={() => setPPUpCount((ppUpCount() + 1) % 4)}
    >
      <span>{ppUpCount()}</span>
      <span class="h-1.5 rounded-sm">
        <Show when={ppUpCount() === 3} fallback={<img class="sharp-pixels" src="/items/068.png" />}>
          <img class="sharp-pixels" src="/items/070.png" />
        </Show>
      </span>
    </div>
  );
}

export default PPCounter;
