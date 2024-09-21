import { convertPokemonStrToASCII } from './utils/hex.jsx';
import NATURES from './utils/Natures.jsx';

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
        "data_section_misc": 12,
        "data_section_growth": 24,
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

function _erraticLevel(level) {
  let result;
  if (level < 50) {
    result = ((level ** 3) * (100 - level)) / 50;
  } else if (level < 68) {
    result = ((level ** 3) * (150 - level)) / 100;
  } else if (level < 98) {
    result = ((level ** 3) * ((1911 - (10 * level)) / 3)) / 100;
  } else {
    result = ((level ** 3) * (160 - level)) / 100;
  }
  return result;
}

function _fluctuatingLevel(level) {
  let result = 0;
  if (level < 15) {
    result = (level ** 3) * (((level + 1) / 3) + 24);
  } else if (level < 36) {
    result = ((level ** 3) * (level + 14)) / 50;
  } else {
    result = ((level ** 3) * ((n / 2) + 32)) / 50
  }
  return result;
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
  // takes in address so we can write to it later...
  constructor(buffer, indexes) {
    this._indexes = indexes;
    this._buffer = buffer;
    this._offsetMap = _buildBoxPokemonOffsetMap([...buffer]);
  }

  copy() {
    return new BoxPokemon(this._buffer, this._indexes);
  }

  getAddress() {
    return this._address;
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

  calculateChecksum() {
    this._decrypt();
    const UINT16_LIMIT = 1 << 16;
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

    return calculatedChecksum;
  }

  isChecksumValid() {
    const checksum = this.getChecksum();
    const calculatedChecksum = this.calculateChecksum();

    return checksum === calculatedChecksum;
  }

  recomputeChecksum() {
    const calculatedChecksum = this.calculateChecksum();

    const storedChecksumOffset = 0x1C;
    this._buffer[storedChecksumOffset] = calculatedChecksum & 0xFF;
    this._buffer[storedChecksumOffset + 1] = (calculatedChecksum >> 8) & 0xFF;
  }

  getChecksum() {
    const checksumOffset = 0x1C;
    const b0 = this._buffer[checksumOffset];
    const b1 = this._buffer[checksumOffset + 1];
    return b0 | b1 << 8;
  }

  getPokeballItemId() {
    this._decrypt();
    const originsOffset = this._offsetMap['data_section_misc'] + 0x3;
    const buffer = BigInt(this._buffer[originsOffset]);
    const ballId = (buffer >> 3n) & 0x0Fn;

    this._encrypt();
    return ballId;
  }

  // takes in the pokeball item id
  setPokeballWithItemId(pokeballId) {
    this._decrypt();

    const originsOffset = this._offsetMap['data_section_misc'] + 0x3;
    const originsByte = BigInt(this._buffer[originsOffset]);

    // only keep three bytes of the id
    const pokeballIdByte = (BigInt(pokeballId) & 0xFn) << 0x3n;

    // zero out only the three bits that we
    // are going to insert back into the byte
    const newByte = (originsByte & 0b10000111n) | pokeballIdByte;

    this._buffer[originsOffset] = Number(newByte);

    this._encrypt();
  }

  isShiny() {
    const otId = this.getOTId()
    const secretId = this.getSecretOtId();
    const personalityValue = this.getPersonalityValue();
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

  getNicknameBytes() {
    const nicknameOffset = 0x8;
    return this._buffer.slice(
      nicknameOffset, nicknameOffset + 10
    );
  }

  setNicknameBytes(bytes) {
    const nicknameOffset = 0x8;
    const truncated = bytes.slice(0, 10);

    let i;
    for (i = 0; i < truncated.length; i += 1) {
      this._buffer[i + nicknameOffset] = truncated[i];
    }
    if (i < 10) {
      this._buffer[i + nicknameOffset] = 0xFF;
    }
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

  // 1 or 0... We'll do a mod 2 on it so it doesn't really matter what you pass in.
  setAbilityBit(abilityBit) {
    this._decrypt();
    const byte = (Number(abilityBit) & 0x1) << 7;
    const offset = this._offsetMap['data_section_misc'] + 7;

    // write only last bit of byte...
    this._buffer[offset] = (this._buffer[offset] & 0x7F) | byte;

    this._encrypt();
  }

  getOTName() {
    const otNameOffset = 0x14;
    const otPkChars = this._buffer.slice(otNameOffset, otNameOffset + 6);
    return convertPokemonStrToASCII(otPkChars);
  }

  _readShort(offset) {
    const [b0, b1] = this._buffer.slice(offset, offset + 2);
    return b0 | (b1 << 8);
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

  setExperiencePoints(experiencePoints) {
    experiencePoints = BigInt(experiencePoints);
    this._decrypt();
    const expOffset = this._offsetMap['data_section_growth'] + 0x4;

    this._buffer[expOffset] = Number(experiencePoints & 0xFFn);
    this._buffer[expOffset + 1] = Number((experiencePoints >> 8n) & 0xFFn);
    this._buffer[expOffset + 2] = Number((experiencePoints >> 16n) & 0xFFn);
    this._buffer[expOffset + 3] = Number((experiencePoints >> 24n) & 0xFFn);

    this._encrypt();
  }

  // takes in a personality value and reorganizes state to accommodate
  setPersonalityValue(personalityValue) {
    this._decrypt();
    personalityValue = BigInt(personalityValue);

    // Each section is twelve bytes long...
    const DATA_SECTION_LENGTH = 12;

    const newDataSectionOffsets = Object.fromEntries(
      Object.entries(
        _getDataSectionOffsets(personalityValue)
      ).map(([key, value]) => ([key, value + this._offsetMap['data']]))
    );

    const growthSectionOffset = this._offsetMap['data_section_growth'];
    const attacksSectionOffset = this._offsetMap['data_section_attacks'];
    const conditionSectionOffset = this._offsetMap['data_section_condition'];
    const miscSectionOffset = this._offsetMap['data_section_misc'];

    const growth = this._buffer.slice(
      growthSectionOffset,
      growthSectionOffset + DATA_SECTION_LENGTH
    );
    const attacks = this._buffer.slice(
      attacksSectionOffset,
      attacksSectionOffset + DATA_SECTION_LENGTH
    );
    const condition = this._buffer.slice(
      conditionSectionOffset,
      conditionSectionOffset + DATA_SECTION_LENGTH
    );
    const misc = this._buffer.slice(
      miscSectionOffset,
      miscSectionOffset + DATA_SECTION_LENGTH
    );

    const newGrowthOffset = newDataSectionOffsets['data_section_growth'];
    for (let i = 0; i < DATA_SECTION_LENGTH; i += 1) {
      this._buffer[newGrowthOffset + i] = growth[i];
    }

    const newAttackOffset = newDataSectionOffsets['data_section_attacks'];
    for (let i = 0; i < DATA_SECTION_LENGTH; i += 1) {
      this._buffer[newAttackOffset + i] = attacks[i];
    }

    const newConditionOffset = newDataSectionOffsets['data_section_condition'];
    for (let i = 0; i < DATA_SECTION_LENGTH; i += 1) {
      this._buffer[newConditionOffset + i] = condition[i];
    }

    const newMiscOffset = newDataSectionOffsets['data_section_misc'];
    for (let i = 0; i < DATA_SECTION_LENGTH; i += 1) {
      this._buffer[newMiscOffset + i] = misc[i];
    }

    // update offset map with new offsets...
    this._offsetMap = {
      ...this._offsetMap,
      ...newDataSectionOffsets,
    };


    const b0 = personalityValue & 0xFFn;
    const b1 = (personalityValue >> 8n) & 0xFFn;
    const b2 = (personalityValue >> 16n) & 0xFFn;
    const b3 = (personalityValue >> 24n) & 0xFFn;

    this._buffer[this._offsetMap['personality_value']] = Number(b0);
    this._buffer[this._offsetMap['personality_value'] + 1] = Number(b1);
    this._buffer[this._offsetMap['personality_value'] + 2] = Number(b2);
    this._buffer[this._offsetMap['personality_value'] + 3] = Number(b3);

    // encrypt with new personality value
    this._encrypt();
  }

  getPersonalityValue() {
    const personalityBits = this
      ._buffer
      .slice(0x0, 0x4)
      .map((b) => BigInt(b));
    const [b0, b1, b2, b3] = personalityBits;
    return b0 | b1 << 8n | b2 << 16n | b3 << 24n;
  }

  getSpeciesId() {
    this._decrypt();
    const speciesOffset = this._offsetMap['data_section_growth'];

    const [e0, e1] = this._buffer.slice(speciesOffset, speciesOffset + 2);
    const species = e1 << 8 | e0;

    this._encrypt();
    return species;
  }

  setSpeciesId(speciesId) {
    this._decrypt();
    const speciesOffset = this._offsetMap['data_section_growth'];
    this._buffer[speciesOffset] = speciesId & 0xFF;
    this._buffer[speciesOffset + 1] = (speciesId >> 8) & 0xFF;

    this._encrypt();
  }

  getMoveIds() {
    this._buffer.reduce((a, b) => a + ',' + b.toString(16).padStart(2, '0'), '')
    this._decrypt();
    const movesOffset = this._offsetMap['data_section_attacks'];
    const moves = [];
    for (let i = 0; i < 4; i += 1) {
      const start = movesOffset + i * 2;
      const b0 = this._buffer[start];
      const b1 = this._buffer[start + 1];
      moves.push(b0 | b1 << 8);
    }
    this._encrypt();

    return moves;
  }

  // slotId: the position of the move...
  // moveId: the identity index of the move to fill the slot with...
  setMove(slotId, moveId) {
    if (slotId > 3 || slotId < 0) {
      throw new RangeError(`slotId of ${slotId} is out of range...`);
    }
    this._decrypt();
    const movesOffset = this._offsetMap['data_section_attacks'] + (slotId * 2);

    this._buffer[movesOffset] = moveId & 0xFF;
    this._buffer[movesOffset + 1] = moveId >> 8 & 0xFF;

    this._encrypt();
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

  // nature is set by personality value...
  getNature() {
    const natureIndex = this.getPersonalityValue() % BigInt(NATURES.length);
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

  // pass in array that has the count of pp ups used...
  setPowerPointIncreases(ppUps) {
    this._encrypt();

    const ppOffset = this._offsetMap['data_section_growth'] + 8;
    const pp0 = Number(ppUps[0]) & 0x3;
    const pp1 = Number(ppUps[1]) & 0x3;
    const pp2 = Number(ppUps[2]) & 0x3;
    const pp3 = Number(ppUps[3]) & 0x3;

    const ppBuffer = pp0 | pp1 << 2 | pp2 << 4 | pp3 << 6;
    this._buffer[ppOffset] = ppBuffer;

    this._decrypt();
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

  // effort value array contains hp, attack, defense, speed,
  // special attack, and special defense in that order
  setEffortValues(evs) {
    this._decrypt();
    const evOffset = this._offsetMap['data_section_condition'];
    for (let i = 0; i < evs.length; i += 1) {
      this._buffer[evOffset + i] = evs[i];
    }
    this._encrypt();
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

  setIndividualValues(ivs) {
    this._decrypt();

    const hp = BigInt(ivs[0]);
    const atk = BigInt(ivs[1]);
    const def = BigInt(ivs[2]);
    const speed = BigInt(ivs[3]);
    const satk = BigInt(ivs[4]);
    const sdef = BigInt(ivs[5]);

    let ivWord = hp | atk << 5n | def << 10n | speed << 15n | satk << 20n | sdef << 25n;
    const b0 = Number(ivWord & 0xFFn);
    const b1 = Number(ivWord >> 8n & 0xFFn);
    const b2 = Number(ivWord >> 16n & 0xFFn);
    const b3 = Number(ivWord >> 24n & 0xFFn);

    const ivOffset = this._offsetMap['data_section_misc'] + 0x4;
    this._buffer[ivOffset] = b0;
    this._buffer[ivOffset + 1] = b1;
    this._buffer[ivOffset + 2] = b2;
    this._buffer[ivOffset + 3] = b3;

    this._encrypt();
  }

  getStats(level, baseStats) {
    const ivs = this.getIndividualValues();
    const evs = this.getEffortValues();
    const hpStat = BoxPokemon._calcHPStat(
      level,
      baseStats.hp,
      ivs.hp,
      evs.hp
    );

    const atkStat = BoxPokemon._calcStat(
      level,
      baseStats.attack,
      ivs.attack,
      evs.attack,
      atkMultiplier
    );
    const defStat = BoxPokemon._calcStat(
      level,
      baseStats.defense,
      ivs.defense,
      evs.defense,
      defMultiplier
    );
    const speedStat = BoxPokemon._calcStat(
      level,
      baseStats.speed,
      ivs.speed,
      evs.speed,
      defMultiplier
    );

    const satkStat = BoxPokemon._calcStat(
      level,
      baseStats.specialAttack,
      ivs.specialAttack,
      evs.specialAttack,
      satkMultiplier
    );
    const sdefStat = BoxPokemon._calcStat(
      level,
      baseStats.specialDefense,
      ivs.specialDefense,
      evs.specialDefense,
      sdefMultiplier
    );

    return {
      hp: hpStat,
      attack: atkStat,
      defense: defStat,
      speed: speedStat,
      specialAttack: satkStat,
      specialDefense: sdefStat,
    };
  }

  static _calcStat(level, base, iv, ev, multiplier) {
  }

  static _calcHPStat(level, base, iv, ev) {
    const numerator = 2 * base + iv + Math.floor(ev / 4) * level;
    return Math.floor(numerator / 100) + level + 10;
  }

  // byte array that contains save bits
  save(saveBits) {
    const indexes = this._indexes;
    for (let i = 0; i < indexes.length; i += 1) {
      saveBits[indexes[i]] = this._buffer[i];
    }
  }

  static buildLevelTable(growthRate) {
    let levelFunction;

    switch (growthRate) {
      case 'erratic':
        levelFunction = (level) => Math.floor(_erraticLevel(level));
        break;
      case 'fast':
        levelFunction = (level) => Math.floor((4 * (level ** 3)) / 5);
        break;
      case 'medium fast':
        levelFunction = (level) => Math.floor(level ** 3);
        break;
      case 'medium slow':
        levelFunction = (level) => {
          const a = (6 / 5) * (level ** 3);
          const b = 15 * (level ** 2);
          const c = 100 * level;
          const d = 140;
          return Math.floor(a - b + c - d);
        };
        break;
      case 'slow':
        levelFunction = (level) => Math.floor((5 * (level ** 3)) / 4);
        break;
      case 'fluctating':
        // todo write fluctuating function
        levelFunction = (level) => Math.floor(_fluctuatingLevel(level));
        break;
      default:
        levelFunction = (level) => level + 1;
        break;
    }

    const levelTable = [0];

    for (let i = 2; i <= 100; i += 1) {
      levelTable.push(levelFunction(i));
    }

    return levelTable;
  }

}

export default BoxPokemon;
