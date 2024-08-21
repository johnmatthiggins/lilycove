function PokemonType({ typeName }) {
  let color;
  let borderColor;

  switch (typeName.toUpperCase()) {
    case 'BUG':
      color = '#a8b920';
      borderColor = '#d1d72f';
      break;
    case 'DARK':
      color = '#705848';
      borderColor = '#a2a275';
      break;
    case 'DRAGON':
      color = '#7038f8';
      borderColor = '#b49bf8';
      break;
    case 'ELECTRIC':
      color = '#f8d132';
      borderColor = '#f8f674';
      break;
    case 'FIGHTING':
      color = '#c03128';
      borderColor = '#ee7c30';
      break;
    case 'FIRE':
      color = '#c03128';
      borderColor = '#f8cb30';
      break;
    case 'FLYING':
      color = '#a890f0';
      borderColor = '#c5bff8';
      break;
    case 'GHOST':
      color = '#705898';
      borderColor = '#a58deb';
      break;
    case 'GRASS':
      color = '#79c94f';
      borderColor = '#bcf75e';
      break;
    case 'GROUND':
      color = '#e0c068';
      borderColor = '#f7f577';
      break;
    case 'ICE':
      color = '#98d8d8';
      borderColor = '#cdf6e6';
      break;
    case 'NORMAL':
      color = '#a8a878';
      borderColor = '#d6d6bd';
      break;
    case 'POISON':
      color = '#a140a0';
      borderColor = '#d07cb0';
      break;
    case 'PSYCHIC':
      color = '#f85888';
      borderColor = '#f8b1aa';
      break;
    case 'ROCK':
      color = '#b8a039';
      borderColor = '#debe65';
      break;
    case 'STEEL':
      color = '#b8b8d0';
      borderColor = '#d6d6c1';
      break;
    case 'WATER':
      color = '#6790f0';
      borderColor = '#95d5d9';
      break;
    default:
      color = 'black';
      borderColor = 'black';
      break;
  }

  return (
    <span
      class="text-md shadow-sm font-mono font-bold rounded-md text-white shadow-sm min-w-24 py-1 text-center border border-solid mr-1"
      style={{ "background-color": color, "border-color": borderColor }}
    >
      {typeName.toUpperCase()}
    </span>
  );
}

export default PokemonType;
