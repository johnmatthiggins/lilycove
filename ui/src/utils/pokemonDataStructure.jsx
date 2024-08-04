import { convertPokemonStrToASCII } from './hex.jsx';

class PokemonData {
  constructor(buffer) {
    this._buffer = buffer;

    const otIdOffset = 0x4;
    const personalityValue = new Uint32Array(buffer.slice(0, 0x4))[0];
    const otId = new Uint32Array(buffer.slice(otIdOffset, otIdOffset + 2))[0];

    const encryptionKey = personalityValue ^ otId;
    this._encryptionKey = encryptionKey;
  }

  getLanguage() {
    const bits = this._buffer[0x12];
    let language;
    switch (bits) {
      case 1:
        language = 'Japanese';
        break;
      case 2:
        language = 'English';
        break;
      case 3:
        language = 'French';
        break;
      case 4:
        language = 'Italian';
        break;
      case 5:
        language = 'German';
        break;
      case 7:
        language = 'Spanish';
        break;
      default:
        language = 'Unknown';
    }

    return language;
  }

  getName() {
    const nicknameOffset = 0x8;
    return convertPokemonStrToASCII(
      this._buffer.slice(
        nicknameOffset, nicknameOffset + 10
      )
    );
  }

  getOTId() {
    const otIdOffset = 0x4;
    const otId = new Uint32Array(buffer.slice(otIdOffset, otIdOffset + 2))[0];

    return otId;
  }

  getOTName() {
    const otNameOffset = 0x14;
    const otPkChars = this._buffer.slice(otNameOffset, otNameOffset + 6);
    const name = convertPokemonStrToASCII(otPkChars);

    return name;
  }

  _readDoubleByte(offset) {
    const offset = 0x5A;
    const [value] = new Uint16Array(
      this._buffer.slice(offset, offset + 2));

    return value;
  }

  getLevel() {
    const offset = 0x54;
    return this._readDoubleByte(offset);
  }

  getCurrentHP() {
    const offset = 0x56;
    return this._readDoubleByte(offset);
  }

  getHPStat() {
    const offset = 0x58;
    return this._readDoubleByte(offset);
  }

  getAttackStat() {
    const offset = 0x5A;
    return this._readDoubleByte(offset);
  }

  getDefenseStat() {
    const offset = 0x5C;
    return this._readDoubleByte(offset);
  }

  getSpeedStat() {
    const offset = 0x5E;
    return this._readDoubleByte(offset);
  }

  getSpecialAttackStat() {
    const offset = 0x60;
    return this._readDoubleByte(offset);
  }

  getSpecialDefenseStat() {
    const offset = 0x62;
    return this._readDoubleByte(offset);
  }

  serialize() {
    // convert back to uint8 array
  }
}

function parsePokemonBuffer(buffer) {
  const otIdOffset = 0x4;
  const nicknameOffset = 0x8;
  const personalityValue = new Uint32Array(buffer.slice(0, 0x4))[0];
  const otId = new Uint32Array(buffer.slice(otIdOffset, otIdOffset + 2))[0];

  // encryption key is needed to decipher
  // data section part of pokemon data structure
  const encryptionKey = personalityValue ^ otId;

  const nickname = convertPokemonStrToASCII(
    buffer.slice(nicknameOffset, nicknameOffset + 10)
  );
  return {
    nickname,
    otId,
  };
}

function getPokemonInParty(saveOffset, bits) {
  const teamSectionOffset = saveOffset + 0xF2C;
  const teamCountBytes = bits.slice(teamSectionOffset + 0x234, teamSectionOffset + 0x238);
  const teamCount = new Uint32Array(teamCountBytes)[0];

  let currentOffset = teamSectionOffset + 0x4;

  const pokemon = [];

  for (let i = 0; i < teamCount; i += 1) {
    currentOffset = (teamSectionOffset + 0x4) + (100 * i);
    const nextPokemon = parsePokemonBuffer(bits.slice(currentOffset, currentOffset + 100));
    pokemon.push(nextPokemon);
  }

  return pokemon;
}


export default {
  PokemonData,
  getPokemonInParty,
}
