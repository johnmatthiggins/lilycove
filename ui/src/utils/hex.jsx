const ASCII_UPPER_CASE_A = 0x41;
const ASCII_LOWER_CASE_A = 0x61;
const ASCII_ZERO = 0x30;

const PKMN_UPPER_CASE_A = 0xbb;
const PKMN_LOWER_CASE_A = 0xd5;
const PKMN_ZERO = 0xa1;

// not my code but dang is this useful...
function bytesToBase64(byte) {
  const key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let bytes = new Uint8Array(byte)
  let newBase64 = ''
  let currentChar = 0
  for (let i = 0; i < bytes.length; i++) {   // Go over three 8-bit bytes to encode four base64 6-bit chars
    if (i % 3 === 0) { // First Byte
      currentChar = (bytes[i] >> 2)      // First 6-bits for first base64 char
      newBase64 += key[currentChar]      // Add the first base64 char to the string
      currentChar = (bytes[i] << 4) & 63 // Erase first 6-bits, add first 2 bits for second base64 char
    }
    if (i % 3 === 1) { // Second Byte
      currentChar += (bytes[i] >> 4)     // Concat first 4-bits from second byte for second base64 char
      newBase64 += key[currentChar]      // Add the second base64 char to the string
      currentChar = (bytes[i] << 2) & 63 // Add two zeros, add 4-bits from second half of second byte
    }
    if (i % 3 === 2) { // Third Byte
      currentChar += (bytes[i] >> 6)     // Concat first 2-bits of third byte for the third base64 char
      newBase64 += key[currentChar]      // Add the third base64 char to the string
      currentChar = bytes[i] & 63        // Add last 6-bits from third byte for the fourth base64 char
      newBase64 += key[currentChar]      // Add the fourth base64 char to the string
    }
  }
  if (bytes.length % 3 === 1) { // Pad for two missing bytes
    newBase64 += `${key[currentChar]}==`
  }
  if (bytes.length % 3 === 2) { // Pad one missing byte
    newBase64 += `${key[currentChar]}=`
  }
  return newBase64
}

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
  } else if (pokemonChar === 0xB1 || pokemonChar === 0xB2) {
    return '"';
  } else if (pokemonChar === 0xB3 || pokemonChar === 0xB4) {
    return "'";
  } else {
    return ' ';
  }
}

function convertPokemonStrToASCII(pokemonByteStr) {
  let output = '';
  for (let i = 0; i < pokemonByteStr.length; i += 1) {
    const byte = pokemonByteStr[i];
    if (byte === 0xFF) {
      break;
    }
    output += convertPokemonCharToASCII(byte);
  }
  return output;
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
  bytesToBase64,
};
