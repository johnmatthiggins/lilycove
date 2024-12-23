import { barrelShiftRight } from './hex';

// This is what it looks like when it starts at zero.
// The first time the game is saved, the save counter
// goes to 1 and it gets shifted from this to having
// pc_buffer_I at the front.
const DEFAULT_SAVE_BLOCK_SECTION_ORDER = [
  "trainer_info",
  "team_and_items",
  "game_state",
  "misc_data",
  "rival_info",
  "pc_buffer_A",
  "pc_buffer_B",
  "pc_buffer_C",
  "pc_buffer_D",
  "pc_buffer_E",
  "pc_buffer_F",
  "pc_buffer_G",
  "pc_buffer_H",
  "pc_buffer_I",
];

// id is the integer index
const SAVE_BLOCK_SECTION_SIZES_BY_ID = [
  3884,
  3968,
  3968,
  3968,
  3848,
  3968,
  3968,
  3968,
  3968,
  3968,
  3968,
  3968,
  3968,
  2000,
];

const SAVE_BLOCK_SIZE = 57344;
const SAVE_BLOCK_SECTION_COUNT = DEFAULT_SAVE_BLOCK_SECTION_ORDER.length;

const SAVE_BLOCK_SECTION_SIZE = 0x1000;

function _readUint32(bytes) {
  if (bytes.length >= 4) {
    const [b0, b1, b2, b3] = bytes.map((b) => BigInt(b));
    return b0 | b1 << 8n | b2 << 16n | b3 << 24n;
  }
  return null;
}

function getSaveBlockOffset(bits) {
  const saveBitsA = bits.slice(0xFFC, 0xFFC + 4)
  const saveBitsB = bits.slice(0xEFFC, 0xEFFC + 4)

  const saveIndexA = _readUint32(saveBitsA);
  const saveIndexB = _readUint32(saveBitsB);

  // TODO: I assume both save indexes
  // exist. This isn't always true. This code needs
  // to be fixed so that you don't need both save indexes to
  // figure out save block offset.
  if (saveIndexA > saveIndexB) {
    return 0x0000;
  }
  return 0xE000;
}

function findSectionAddresses(bits) {
  const saveBlockOffset = getSaveBlockOffset(bits);

  const saveCounterAddress = 0x0FFC;
  const saveCounter = _readUint32(
    bits.slice(saveBlockOffset + saveCounterAddress, saveBlockOffset + saveCounterAddress + 0x4)
  );

  const shiftCount = Number(saveCounter) % SAVE_BLOCK_SECTION_COUNT;

  const currentOrdering = barrelShiftRight(DEFAULT_SAVE_BLOCK_SECTION_ORDER, shiftCount);
  const offsets = {};
  let currentAddress = saveBlockOffset;

  for (let i = 0; i < currentOrdering.length; i += 1) {
    const sectionName = currentOrdering[i];
    offsets[sectionName] = currentAddress;

    // add offset to next section...
    currentAddress += SAVE_BLOCK_SECTION_SIZE;
  }
  return offsets;
}

function isSaveBlockSectionValid(sectionBits) {
  const [b0, b1] = sectionBits.slice(0x0FF4, 0x0FF6);
  const sectionId = b0 | (b1 << 8);

  // count of bytes that actually have content in them...
  const contentfulBytes = SAVE_BLOCK_SECTION_SIZES_BY_ID[sectionId];
  let checksum = 0n;

  // not inclusive
  const UINT32_LIMIT = 0x100000000n;
  const UINT16_LIMIT = 0x10000n;

  for (let i = 0; i < contentfulBytes; i += 4) {
    const b0 = BigInt(sectionBits[i]);
    const b1 = BigInt(sectionBits[i + 1]);
    const b2 = BigInt(sectionBits[i + 2]);
    const b3 = BigInt(sectionBits[i + 3]);
    const nextWord = b0 | (b1 << 8n) | (b2 << 16n) | (b3 << 24n);

    checksum = (checksum + nextWord) % UINT32_LIMIT;
  }

  const storedChecksum = BigInt(sectionBits[0x0FF6]) | (BigInt(sectionBits[0x0FF7]) << 8n);
  const shortChecksum = ((checksum >> 16n) + (checksum & 0xFFFFn)) % UINT16_LIMIT;

  return shortChecksum === storedChecksum;
}

function isSaveBlockValid(bits) {
  for (let i = 0; i < SAVE_BLOCK_SECTION_COUNT; i += 1) {
    const start = i * SAVE_BLOCK_SECTION_SIZE;
    const end = (i * SAVE_BLOCK_SECTION_SIZE) + SAVE_BLOCK_SECTION_SIZE;
    const blockSectionBits = bits.slice(start, end);
    if (!isSaveBlockSectionValid(blockSectionBits)) {
      return false;
    }
  }
  return true;
}

// takes in a byte array...
function areChecksumsValid(bits) {
  if (!isSaveBlockValid(bits.slice(0, SAVE_BLOCK_SIZE))) {
    return false;
  } else if (!isSaveBlockValid(bits.slice(SAVE_BLOCK_SIZE, SAVE_BLOCK_SIZE * 2))) {
    return false;
  }
  return true;
}

function computeSaveBlockSectionChecksum(sectionBits) {
  const [b0, b1] = sectionBits.slice(0x0FF4, 0x0FF6);
  const sectionId = b0 | (b1 << 8);

  // count of bytes that actually have content in them...
  const contentfulBytes = SAVE_BLOCK_SECTION_SIZES_BY_ID[sectionId];
  let checksum = 0n;

  // not inclusive
  const UINT32_LIMIT = 0x100000000n;
  const UINT16_LIMIT = 0x10000n;

  for (let i = 0; i < contentfulBytes; i += 4) {
    const b0 = BigInt(sectionBits[i]);
    const b1 = BigInt(sectionBits[i + 1]);
    const b2 = BigInt(sectionBits[i + 2]);
    const b3 = BigInt(sectionBits[i + 3]);
    const nextWord = b0 | (b1 << 8n) | (b2 << 16n) | (b3 << 24n);

    checksum = (checksum + nextWord) % UINT32_LIMIT;
  }

  return ((checksum >> 16n) + (checksum & 0xFFFFn)) % UINT16_LIMIT;
}

function recomputeSaveBlockChecksums(bits, blockOffset) {
  for (let i = 0; i < SAVE_BLOCK_SECTION_COUNT; i += 1) {
    const sectionStart = (i * SAVE_BLOCK_SECTION_SIZE) + blockOffset;
    const sectionEnd = (i * SAVE_BLOCK_SECTION_SIZE) + SAVE_BLOCK_SECTION_SIZE + blockOffset;
    const blockSectionBits = bits.slice(sectionStart, sectionEnd);

    const checksum = Number(computeSaveBlockSectionChecksum(blockSectionBits));

    bits[sectionStart + 0xFF6] = checksum & 0xFF;
    bits[sectionStart + 0xFF7] = (checksum >> 8) & 0xFF;
  }
}

function recomputeSaveChecksums(bits) {
  recomputeSaveBlockChecksums(bits, 0);
  recomputeSaveBlockChecksums(bits, SAVE_BLOCK_SIZE);
}

export {
  recomputeSaveChecksums,
  findSectionAddresses,
  areChecksumsValid,
};
