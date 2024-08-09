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
  const buffer = left.concat(right);
  return buffer;
}

// returns array of occurrences of bit vector
function findBitVector(bits, search) {
  const occurrences = [];
  for (let i = 0; i < bits.length; i += 1) {
    for (let j = 0; j < search.length; j += 1) {
      if (bits[i + j] === search[j]) {
        if (j === search.length - 1) {
          occurrences.push(i);
        }
      } else {
        break;
      }
    }
  }
  return occurrences;
}

function convertPokemonCharToASCII(pokemonChar) {
  if (pokemonChar >= PKMN_UPPER_CASE_A && pokemonChar < PKMN_LOWER_CASE_A) {
    const charCode = ASCII_UPPER_CASE_A + (pokemonChar - PKMN_UPPER_CASE_A);
    return String.fromCharCode(charCode);
  } else if (pokemonChar >= PKMN_LOWER_CASE_A && pokemonChar < PKMN_LOWER_CASE_A + 26) {
    const charCode = ASCII_LOWER_CASE_A + (pokemonChar - PKMN_LOWER_CASE_A);
    return String.fromCharCode(charCode);
  } else if (pokemonChar >= PKMN_ZERO && pokemonChar < PKMN_ZERO + 10) {
    const charCode = ASCII_ZERO + (pokemonChar - PKMN_ZERO);
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

function byteArrayToInt(byteArray) {
  let value = 0;
  for (let i = 0; i < byteArray; i++) {
    value += (byteArray[byteArray.length - i - 1] << (8 * i));
  }

  return value;
};

export {
  findBitVector,
  parseTrainerName,
  convertPokemonStrToASCII,
  barrelShiftRight,
  byteArrayToInt,
};
