import { convertPokemonStrToASCII } from './hex.jsx';

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
  const a = hp & 0x1;
  const b = attack & 0x1;
  const c = defense & 0x1;
  const d = speed & 0x1;
  const e = spAttack & 0x1;
  const f = spDefense & 0x1;

  const binary = parseInt(`${f}${e}${d}${c}${b}${a}`, 2);
  const typeIndex = Math.floor((binary * 15) / 63);

  return TYPE_LIST[typeIndex];
}

function hiddenPowerPower(hp, attack, defense, speed, spAttack, spDefense) {
  const a = (hp & 0x2) >> 1;
  const b = (attack & 0x2) >> 1;
  const c = (defense & 0x2) >> 1;
  const d = (speed & 0x2) >> 1;
  const e = (spAttack & 0x2) >> 1;
  const f = (spDefense & 0x2) >> 1;

  const binary = parseInt(`${f}${e}${d}${c}${b}${a}`, 2);
  const power = Math.floor((binary * 40) / 63) + 30;

  return power;
}

export {
  getPokemonInParty,
  hiddenPowerType,
  hiddenPowerPower,
}
