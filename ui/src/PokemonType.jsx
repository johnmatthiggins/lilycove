function PokemonType({ typeName }) {
  let color;

  switch (typeName.toUpperCase()) {
    case 'BUG':
      color = '#a8b920';
      break;
    case 'DARK':
      color = '#705848';
      break;
    case 'DRAGON':
      color = '#7038f8';
      break;
    case 'ELECTRIC':
      color = '#f8d132';
      break;
    case 'FIGHTING':
      color = '#c03128';
      break;
    case 'FIRE':
      color = '#c03128';
      break;
    case 'FLYING':
      color = '#a890f0';
      break;
    case 'GHOST':
      color = '#705898';
      break;
    case 'GRASS':
      color = '#79c94f';
      break;
    case 'GROUND':
      color = '#e0c068';
      break;
    case 'ICE':
      color = '#98d8d8';
      break;
    case 'NORMAL':
      color = '#a8a878';
      break;
    case 'POISON':
      color = '#a140a0';
      break;
    case 'PSYCHIC':
      color = '#f85888';
      break;
    case 'ROCK':
      color = '#b8a039';
      break;
    case 'STEEL':
      color = '#b8b8d0';
      break;
    case 'WATER':
      color = '#6790f0';
      break;
    default:
      color = 'red';
      break;
  }

  return (
    <div class="font-mono font-bold rounded-full text-white shadow-sm w-32 py-1 text-center" style={{ "background-color": color }}>
      {typeName}
    </div>
  );
}

export default PokemonType;
