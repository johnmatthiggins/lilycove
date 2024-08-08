import { convertPokemonStrToASCII } from './hex.jsx';

function _padZeros(buffer, desiredLength) {
  const paddingLength = desiredLength - buffer.length;
  const padding = new Array(paddingLength).map((_) => 0);

  return buffer.concat(padding);
}

// length in bytes of the data section
// of the pokemon data structure
const DATA_SECTION_LENGTH = 48;

function _getDataSectionOffsets(
  personalityValue
) {
  // const encryptionKey = personalityValue ^ originalTrainerId;
  // let unencryptedBuffer = new Array(DATA_SECTION_LENGTH).map((_) => 0x0);
  //
  // for (let i = 0; i < dataSectionBuffer; i += 4) {
  //   for (let j = 0; j < 4; i += 1) {
  //     unencryptedBuffer[i + j] = encryptionKey[j] ^ dataSectionBuffer[i + j];
  //   }
  // }

  switch (personalityValue) {
    case 0:
      return {
        "data_section_growth": 0,
        "data_section_attacks": 12,
        "data_section_condition": 24,
        "data_section_misc": 36,
      };
    case 1:
      return {
        "data_section_growth": 0,
        "data_section_attacks": 12,
        "data_section_misc": 24,
        "data_section_condition": 36,
      };
    case 2:
      return {
        "data_section_growth": 0,
        "data_section_condition": 12,
        "data_section_attacks": 24,
        "data_section_misc": 36,
      };
    case 3:
      return {
        "data_section_growth": 0,
        "data_section_condition": 12,
        "data_section_attacks": 24,
        "data_section_misc": 36,
      };
    case 4:
      return {
        "data_section_growth": 0,
        "data_section_misc": 12,
        "data_section_attacks": 24,
        "data_section_condition": 36,
      };
    case 5:
      return {
        "data_section_growth": 0,
        "data_section_misc": 12,
        "data_section_condition": 24,
        "data_section_attacks": 36,
      };
    case 6:
      return {
        "data_section_attacks": 0,
        "data_section_growth": 12,
        "data_section_condition": 24,
        "data_section_misc": 36,
      };
    case 7:
      return {
        "data_section_attacks": 0,
        "data_section_growth": 12,
        "data_section_misc": 24,
        "data_section_condition": 36,
      };
    case 8:
      return {
        "data_section_attacks": 0,
        "data_section_condition": 12,
        "data_section_growth": 24,
        "data_section_misc": 36,
      };
    case 9:
      return {
        "data_section_attacks": 0,
        "data_section_condition": 12,
        "data_section_misc": 24,
        "data_section_growth": 36,
      };
    case 10:
      return {
        "data_section_growth": 0,
        "data_section_misc": 12,
        "data_section_attacks": 24,
        "data_section_condition": 36,
      };
    case 11:
      return {
        "data_section_attacks": 0,
        "data_section_misc": 12,
        "data_section_condition": 24,
        "data_section_growth": 36,
      };
    case 12:
      return {
        "data_section_condition": 0,
        "data_section_growth": 12,
        "data_section_attacks": 24,
        "data_section_misc": 36,
      };
    case 13:
      return {
        "data_section_condition": 0,
        "data_section_growth": 12,
        "data_section_misc": 24,
        "data_section_attacks": 36,
      };
    case 14:
      return {
        "data_section_condition": 0,
        "data_section_attacks": 12,
        "data_section_growth": 24,
        "data_section_misc": 36,
      };
    case 15:
      return {
        "data_section_condition": 0,
        "data_section_attacks": 12,
        "data_section_misc": 24,
        "data_section_growth": 36,
      };
    case 16:
      return {
        "data_section_condition": 0,
        "data_section_misc": 12,
        "data_section_growth": 24,
        "data_section_attacks": 36,
      };
    case 17:
      return {
        "data_section_condition": 0,
        "data_section_misc": 12,
        "data_section_attacks": 24,
        "data_section_growth": 36,
      };
    case 18:
      return {
        "data_section_misc": 0,
        "data_section_growth": 12,
        "data_section_attacks": 24,
        "data_section_condition": 36,
      };
    case 19:
      return {
        "data_section_misc": 0,
        "data_section_growth": 12,
        "data_section_condition": 24,
        "data_section_attacks": 36,
      };
    case 20:
      return {
        "data_section_misc": 0,
        "data_section_attacks": 12,
        "data_section_growth": 24,
        "data_section_condition": 36,
      };
    case 21:
      return {
        "data_section_misc": 0,
        "data_section_attacks": 12,
        "data_section_condition": 24,
        "data_section_growth": 36,
      };
    case 22:
      return {
        "data_section_misc": 0,
        "data_section_condition": 12,
        "data_section_growth": 24,
        "data_section_attacks": 36,
      };
    case 23:
      return {
        "data_section_misc": 0,
        "data_section_condition": 12,
        "data_section_attacks": 24,
        "data_section_growth": 36,
      };
    default:
      return {};
  }
}

function _buildBoxPokemonOffsetMap(buffer) {
  const personalityBits = buffer.slice(0x0, 0x4);
  const personalityValue = new Uint32Array(personalityBits)[0] % 24;

  const dataOffset = 0x20;

  // add 0x20 to all the offsets found here...
  const dataSectionOffsets = Object.fromEntries(Object.entries(
    _getDataSectionOffsets(personalityValue)
  ).map(([key, value]) => ([key, value + dataOffset])));

  const offsetMap = {
    "personality_value": 0x0,
    "ot_id": 0x04,
    "nickname": 0x08,
    "language": 0x12,
    "misc_flags": 0x13,
    "ot_name": 0x14,
    "markings": 0x1b,
    "checksum": 0x1c,
    "unknown_section": 0x1e,
    "data": 0x20,
    ...dataSectionOffsets,
  };

  return offsetMap;
}

class BoxPokemon {
  constructor(buffer) {
    this._buffer = [...buffer];
    this._offsetMap = _buildBoxPokemonOffsetMap([...buffer]);

    const personalityValue = this._readInt32(0);
    const otId = this._readInt32(0x4);
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

  _readShort(offset) {
    const shortBits = this._buffer.slice(offset, offset + 2);
    console.log('shortBits = ', shortBits);
    const [value] = new Uint16Array(shortBits);

    return value;
  }

  _readInt32(offset) {
    const [value] =
      new Uint32Array(this._buffer.slice(offset, offset + 4));

    return value;
  }

  getLevel() {
    const offset = 0x54;
    console.log('buffer = ', this._buffer);
    return this._readShort(offset);
  }

  getSpeciesId() {
    const speciesOffset = this._offsetMap['data_section_growth'];
    const species = this._readShort(speciesOffset) ^ (
      this._encryptionKey & 0xffff0000
    );

    return species;
  }

  getEffortValues() {
    const evOffset = this._offsetMap['data_section_condition'];
    const effortValueBits = this._buffer
      .slice(evOffset, evOffset + 0x6)
      .map((b, i) => {
        const keyBit = (this._encryptionKey >> (i % 4)) & 0xff;
        return keyBit ^ b;
      });

    const [hpEv, atkEv, defEv, spdEv, spAtkEv, spDefEv] = effortValueBits;
    return {
      "HP": hpEv,
      "Attack": atkEv,
      "Defense": defEv,
      "Speed": spdEv,
      "Special Attack": spAtkEv,
      "Special Defense": spDefEv,
    };
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


export {
  BoxPokemon,
  getPokemonInParty,
}
