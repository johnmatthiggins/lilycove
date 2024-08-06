const ASCII_UPPER_CASE_A = 0x41;
const ASCII_LOWER_CASE_A = 0x61;
const ASCII_ZERO = 0x30;

const PKMN_UPPER_CASE_A = 0xbb;
const PKMN_LOWER_CASE_A = 0xd5;
const PKMN_LEFT_ARROW = 0xd5;
const PKMN_ZERO = 0xa1;
const PKMN_BANG = 0xab;

function barrelShiftRight(array, count) {
  const right = array.slice(0, array.length - count);
  const left = array.slice(array.length - count, array.length);
  return left.concat(right);
}

// returns array of occurrences of bit vector
function findBitVector(bits, search) {
  const savePositions = [];
  for (let i = 0; i < bits.length; i += 1) {
    for (let j = 0; j < search.length; j += 1) {
      if (bits[i + j] === search[j]) {
        if (j === search.length - 1) {
          savePositions.push(i);
        }
      } else {
        break;
      }
    }
  }

  return savePositions;
}

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
  findBitVector,
  parseTrainerName,
  convertPokemonStrToASCII,
};
