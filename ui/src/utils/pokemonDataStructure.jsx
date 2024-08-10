import { convertPokemonStrToASCII } from './hex.jsx';

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

  // personalityValue needs to be a big int
  const modValue = personalityValue % BigInt(24);
  switch (Number(modValue)) {
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
        "data_section_misc": 24,
        "data_section_attacks": 36,
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
        "data_section_attacks": 0,
        "data_section_growth": 12,
        "data_section_misc": 24,
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
  const hexValue = personalityBits.map(
    (b) => b.toString(16).padStart(2, '0')
  ).join('');
  const personalityValue = BigInt(`0x${hexValue}`);
  console.log('personalityValue = ', personalityValue);

  const dataOffset = 0x20;

  // add 0x20 to all the offsets found here...
  const dataSectionOffsets = Object.fromEntries(Object.entries(
    _getDataSectionOffsets(personalityValue)
  ).map(([key, value]) => ([key, value + dataOffset])));

  console.log(dataSectionOffsets);

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
    this._buffer = buffer;
    this._offsetMap = _buildBoxPokemonOffsetMap([...buffer]);
  }

  _getEncryptionKey() {
    const encryptionKey = [0, 0, 0, 0].map(
      (_, i) => this._buffer[i] ^ this._buffer[i + 4]
    );

    return encryptionKey;
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

  hasSpecies() {
    const hasSpeciesByteOffset = 0x13;
    const bit = this._buffer[hasSpeciesByteOffset] & 0x2;
    return bit > 0;
  }

  getOTId() {
    const otIdOffset = 0x4;
    const [b0, b1] = buffer.slice(otIdOffset, otIdOffset + 2);
    const otId = b0 | b1 << 8;

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
    const [b0, b1] = shortBits;
    const value = b0 | (b1 << 8);

    return value;
  }

  _readInt32(offset) {
    const bits = this._buffer.slice(offset, offset + 4);
    const [b0, b1, b2, b3] = bits;
    const value = (b0 << 0) | (b1 << 8) | (b2 << 16) | (b3 << 24);

    return value;
  }

  getLevel() {
    const offset = 0x54;
    return this._readShort(offset);
  }

  _getPersonalityValue() {
    const personalityBits = this._buffer.slice(0x0, 0x4);
    const [b0, b1, b2, b3] = personalityBits;
    const personalityValue = b0 | b1 << 8 | b2 << 16 | b3 << 24;

    return personalityValue;
  }

  getSpeciesId() {
    const speciesOffset = this._offsetMap['data_section_growth'];
    console.log('personalityValue = ', this._getPersonalityValue().toString(16));

    const [e0, e1] = this._buffer.slice(speciesOffset, speciesOffset + 2);
    const encryptedSpecies = e1 << 8 | e0;

    const fullKey = this._getEncryptionKey();
    console.log('key = ', fullKey.map((b) => b.toString(16).padStart(2, '0')));
    const [b0, b1] = fullKey;
    const halfKey = b1 << 8 | b0;

    const species = encryptedSpecies ^ halfKey;
    // if (species > 251) {
    //   return species - 31;
    // }

    return species;
  }

  getEffortValues() {
    const evOffset = this._offsetMap['data_section_condition'];
    const effortValueBits = this._buffer
      .slice(evOffset, evOffset + 0x6)
      .map((b, i) => {
        const keyBit = (this._getEncryptionKey() >> ((i % 4) * 8)) & 0xff;
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
