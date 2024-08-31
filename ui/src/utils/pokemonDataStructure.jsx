import { convertPokemonStrToASCII } from './hex.jsx';

const NATURES = [
  { name: "Hardy", increase: 'Atk', decrease: 'Atk' },
  { name: "Lonely", increase: 'Atk', decrease: 'Def' },
  { name: "Brave", increase: 'Atk', decrease: 'Spe' },
  { name: "Adamant", increase: 'Atk', decrease: 'SpA' },
  { name: "Naughty", increase: 'Atk', decrease: 'SpD' },
  { name: "Bold", increase: 'Def', decrease: 'Atk' },
  { name: "Docile", increase: 'Def', decrease: 'Def' },
  { name: "Relaxed", increase: 'Def', decrease: 'Spe' },
  { name: "Impish", increase: 'Def', decrease: 'SpA' },
  { name: "Lax", increase: 'Def', decrease: 'SpD' },
  { name: "Timid", increase: 'Spe', decrease: 'Atk' },
  { name: "Hasty", increase: 'Spe', decrease: 'Def' },
  { name: "Serious", increase: 'Spe', decrease: 'Spe' },
  { name: "Jolly", increase: 'Spe', decrease: 'SpA' },
  { name: "Naive", increase: '', decrease: '' },
  { name: "Modest", increase: 'SpA', decrease: 'Atk' },
  { name: "Mild", increase: 'SpA', decrease: 'Def' },
  { name: "Quiet", increase: 'SpA', decrease: 'Spe' },
  { name: "Bashful", increase: 'SpA', decrease: 'SpA' },
  { name: "Rash", increase: 'SpA', decrease: 'SpD' },
  { name: "Calm", increase: 'SpD', decrease: 'Atk' },
  { name: "Gentle", increase: 'SpD', decrease: 'Def' },
  { name: "Sassy", increase: 'SpD', decrease: 'Spe' },
  { name: "Careful", increase: 'SpD', decrease: 'SpA' },
  { name: "Quirky", increase: 'SpD', decrease: 'SpD' },
];

function _getDataSectionOffsets(
  personalityValue
) {
  // personalityValue needs to be a big int
  // please don't ask me why
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
  const personalityBits = buffer.slice(0x0, 0x4).map((b) => BigInt(b));
  const [b0, b1, b2, b3] = personalityBits;
  const personalityValue = b0 | (b1 << 8n) | (b2 << 16n) | (b3 << 24n);

  const dataOffset = 0x20;

  // add 0x20 to all the offsets found here...
  const dataSectionOffsets = Object.fromEntries(
    Object.entries(
      _getDataSectionOffsets(personalityValue)
    ).map(([key, value]) => ([key, value + dataOffset]))
  );

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

  _decrypt() {
    const key = this._getEncryptionKey();
    const dataSectionOffset = this._offsetMap['data'];
    for (let i = 0; i < 48; i += 1) {
      this._buffer[dataSectionOffset + i] ^= key[i % key.length];
    }
  }

  _encrypt() {
    const key = this._getEncryptionKey();
    const dataSectionOffset = this._offsetMap['data'];
    for (let i = 0; i < 48; i += 1) {
      this._buffer[dataSectionOffset + i] ^= key[i % key.length];
    }
  }

  isChecksumValid() {
    this._decrypt();
    const UINT16_LIMIT = 1 << 16;
    const checksum = this.getChecksum();
    const dataOffset = this._offsetMap['data'];
    const dataSectionLength = 48;
    let calculatedChecksum = 0;

    for (let i = 0; i < dataSectionLength; i += 2) {
      const offset = dataOffset + i;
      const b0 = this._buffer[offset];
      const b1 = this._buffer[offset + 1];
      const nextShort = b0 | b1 << 8;
      calculatedChecksum = (calculatedChecksum + nextShort) % UINT16_LIMIT;
    }

    this._encrypt();
    return checksum === calculatedChecksum;
  }

  getChecksum() {
    const checksumOffset = 0x1C;
    const [b0, b1] = this._buffer.slice(checksumOffset, checksumOffset + 2);

    const checksum = b0 | b1 << 8;
    return checksum;
  }

  getPokeballItemId() {
    this._decrypt();
    const originsOffset = this._offsetMap['data_section_misc'] + 0x3;
    const buffer = BigInt(this._buffer[originsOffset]);
    const ballId = (buffer >> 3n) & 0x0Fn;

    const threeDigitBallId = String(ballId + 1n).padStart(3, '0');
    this._encrypt();
    return threeDigitBallId;
  }

  isShiny() {
    const otId = this.getOTId()
    const secretId = this.getSecretOtId();
    const personalityValue = this._getPersonalityValue();
    const personalityValueA = Number((personalityValue & 0xFFFF0000n) >> 16n);
    const personalityValueB = Number(personalityValue & 0xFFFFn);
    const code = otId ^ secretId ^ personalityValueA ^ personalityValueB;

    return code < 8;
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
    const [b0, b1] = this._buffer.slice(otIdOffset, otIdOffset + 2);
    const otId = b0 | b1 << 8;

    return otId;
  }

  getSecretOtId() {
    const secretIdOffset = 0x6;
    const [b0, b1] = this._buffer.slice(secretIdOffset, secretIdOffset + 2);
    const otId = b0 | b1 << 8;

    return otId;
  }

  getAbilityBit() {
    this._decrypt();
    const abilityOffset = this._offsetMap['data_section_misc'] + 7;
    const abilityIndex = (this._buffer[abilityOffset] >> 7) & 0x1;
    this._encrypt();
    return abilityIndex;
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

  getExperiencePoints() {
    this._decrypt();
    const expOffset = this._offsetMap['data_section_growth'] + 0x4;
    const [b0, b1, b2, b3] = this._buffer
      .slice(expOffset, expOffset + 4)
      .map((b) => BigInt(b));
    const experiencePoints = b0 | b1 << 8n | b2 << 16n | b3 << 24n;

    this._encrypt();
    return experiencePoints;
  }

  _getPersonalityValue() {
    const personalityBits = this
      ._buffer
      .slice(0x0, 0x4)
      .map((b) => BigInt(b));
    const [b0, b1, b2, b3] = personalityBits;
    const personalityValue = b0 | b1 << 8n | b2 << 16n | b3 << 24n;

    return personalityValue;
  }

  getSpeciesId() {
    this._decrypt();
    const speciesOffset = this._offsetMap['data_section_growth'];

    const [e0, e1] = this._buffer.slice(speciesOffset, speciesOffset + 2);
    const species = e1 << 8 | e0;

    this._encrypt();
    return species;
  }

  getMoveIds() {
    this._decrypt();
    const movesOffset = this._offsetMap['data_section_attacks'];
    const ids = Array(4).fill(0).map((_, i) => {
      const start = movesOffset + i * 2;
      const end = movesOffset + (i + 1) * 2;
      const [b0, b1] = this._buffer.slice(start, end);
      const index = b0 | b1 << 8;
      return index;
    });
    this._encrypt();

    return ids;
  }

  getItemCode() {
    this._decrypt();
    const itemOffset = this._offsetMap['data_section_growth'] + 2;
    const [b0, b1] = this._buffer.slice(itemOffset, itemOffset + 2);
    const code = b0 | b1 << 8;
    this._encrypt();
    return code;
  }

  setItemCode(itemCode) {
    this._decrypt();
    const b0 = itemCode & 0xFF;
    const b1 = (itemCode >> 8) & 0xFF;
    const offset = this._offsetMap['data_section_growth'] + 2;

    this._buffer[offset] = b0;
    this._buffer[offset + 1] = b1;
    this._encrypt();
  }

  getNature() {
    const natureIndex = this._getPersonalityValue() % BigInt(NATURES.length);
    return NATURES[natureIndex];
  }

  getPowerPointIncreases() {
    this._decrypt();
    const ppOffset = this._offsetMap['data_section_growth'] + 8;
    const ppBuffer = this._buffer[ppOffset];
    const pp0 = ppBuffer & 0x3;
    const pp1 = (ppBuffer >> 2) & 0x3;
    const pp2 = (ppBuffer >> 4) & 0x3;
    const pp3 = (ppBuffer >> 6) & 0x3;

    this._encrypt();

    // unpack these bad boys and send them up
    return [pp0, pp1, pp2, pp3];
  }

  getEffortValues() {
    this._decrypt();
    const evOffset = this._offsetMap['data_section_condition'];
    const effortValueBits = this._buffer
      .slice(evOffset, evOffset + 0x6);

    const [hpEv, atkEv, defEv, spdEv, spAtkEv, spDefEv] = effortValueBits;
    this._encrypt();
    return {
      "hp": hpEv,
      "attack": atkEv,
      "defense": defEv,
      "speed": spdEv,
      "specialAttack": spAtkEv,
      "specialDefense": spDefEv,
    };
  }

  getIndividualValues() {
    this._decrypt();
    // bit mask that extracts first thirty bits
    const firstFiveBits = 31n;
    const ivOffset = this._offsetMap['data_section_misc'] + 0x4;
    const [b0, b1, b2, b3] = this._buffer
      .slice(ivOffset, ivOffset + 0x4).map((b) => BigInt(b));

    const word = b0 | b1 << 8n | b2 << 16n | b3 << 24n;
    const hpIv = word & firstFiveBits;
    const attackIv = (word >> 5n) & firstFiveBits;
    const defenseIv = (word >> 10n) & firstFiveBits;
    const speedIv = (word >> 15n) & firstFiveBits;
    const sAttackIv = (word >> 20n) & firstFiveBits;
    const sDefenseIv = (word >> 25n) & firstFiveBits;

    this._encrypt();

    return {
      "hp": Number(hpIv),
      "attack": Number(attackIv),
      "defense": Number(defenseIv),
      "speed": Number(speedIv),
      "specialAttack": Number(sAttackIv),
      "specialDefense": Number(sDefenseIv),
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

const TYPE_LIST = [
  'FIGHTING',
  'FLYING',
  'POISON',
  'GROUND',
  'ROCK',
  'BUG',
  'GHOST',
  'STEEL',
  'FIRE',
  'WATER',
  'GRASS',
  'ELECTRIC',
  'PSYCHIC',
  'ICE',
  'DRAGON',
  'DARK',
];
function hiddenPowerType(hp, attack, defense, speed, spAttack, spDefense) {
  const a = hp % 2;
  const b = attack % 2;
  const c = defense % 2;
  const d = speed % 2;
  const e = spAttack % 2;
  const f = spDefense % 2;

  const binary = parseInt(`${f}${e}${d}${c}${b}${a}`, 2);
  const typeIndex = Math.floor((binary * 15) / 63);

  return TYPE_LIST[typeIndex];
}


export {
  NATURES,
  BoxPokemon,
  getPokemonInParty,
  hiddenPowerType,
}
