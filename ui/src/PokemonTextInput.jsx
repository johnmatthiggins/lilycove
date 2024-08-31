import { createSignal } from "solid-js";

/* A text input that handles Pokemon's proprietary text format */
function PokemonTextInput({
  id,
  label,
  value,
  onChange,
}) {
  const [focused, setFocused] = createSignal(false);
  let ref;

  return (
    <>
      <label for={id}>{label}</label>
      <span id={id} ref={ref}>
      </span>
    </>
  );
}

export default PokemonTextInput;
