const ASCII_UPPER_CASE_A = 0x41;
const ASCII_LOWER_CASE_A = 0x61;
const ASCII_ZERO = 0x30;

const PKMN_UPPER_CASE_A = 0xbb;
const PKMN_LOWER_CASE_A = 0xd5;
const PKMN_LEFT_ARROW = 0xd5;
const PKMN_ZERO = 0xa1;
const PKMN_BANG = 0xab;

function convertPokemonCharToASCII(pokemonChar) {
  if (pokemonChar >= PKMN_UPPER_CASE_A && pokemonChar < PKMN_LOWER_CASE_A) {
    const charCode = ASCII_UPPER_CASE_A + (pokemonChar - PKMN_UPPER_CASE_A);
    return String.fromCharCode(charCode);
  } else if (pokemonChar >= PKMN_LOWER_CASE_A && pokemonChar < PKMN_LEFT_ARROW) {
    const charCode = ASCII_LOWER_CASE_A + (pokemonChar - PKMN_LOWER_CASE_A);
    return String.fromCharCode(charCode);
  } else if (pokemonChar >= PKMN_ZERO && pokemonChar < PKMN_BANG) {
    const charCode = ASCII_ZERO + (pokemonChar - PKMN_BANG);
    return String.fromCharCode(charCode);
  } else {
    return ' ';
  }
}

function convertPokemonStrToASCII(pokemonByteStr) {
  return pokemonByteStr
    .map((byte) => convertPokemonCharToASCII(byte))
    .join("");
}

function parseTrainerName(bytes) {
  return convertPokemonStrToASCII(bytes);
}

export default {
  parseTrainerName,
  convertPokemonStrToASCII,
};
