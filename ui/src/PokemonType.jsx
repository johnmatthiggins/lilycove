function PokemonType({ typeName, fullWidth = false }) {
  const colors = () => {
    let color;
    let borderColor;
    switch (typeName().toUpperCase()) {
      case 'BUG':
        borderColor = '#a8b920';
        color = '#d1d72f';
        break;
      case 'DARK':
        borderColor = '#705848';
        color = '#a2a275';
        break;
      case 'DRAGON':
        borderColor = '#7038f8';
        color = '#b49bf8';
        break;
      case 'ELECTRIC':
        borderColor = '#f8d132';
        color = '#f8f674';
        break;
      case 'FIGHTING':
        borderColor = '#C2452D';
        color = '#ee7c30';
        break;
      case 'FIRE':
        borderColor = '#f08030';
        color = '#f8cb30';
        break;
      case 'FLYING':
        borderColor = '#a890f0';
        color = '#c5bff8';
        break;
      case 'GHOST':
        borderColor = '#705898';
        color = '#a58deb';
        break;
      case 'GRASS':
        borderColor = '#79c94f';
        color = '#bcf75e';
        break;
      case 'GROUND':
        borderColor = '#e0c068';
        color = '#f7f577';
        break;
      case 'ICE':
        borderColor = '#98d8d8';
        color = '#cdf6e6';
        break;
      case 'NORMAL':
        borderColor = '#a8a878';
        color = '#d6d6bd';
        break;
      case 'POISON':
        borderColor = '#a140a0';
        color = '#d07cb0';
        break;
      case 'PSYCHIC':
        borderColor = '#f85888';
        color = '#f8b1aa';
        break;
      case 'ROCK':
        borderColor = '#b8a039';
        color = '#debe65';
        break;
      case 'STEEL':
        borderColor = '#b8b8d0';
        color = '#d6d6c1';
        break;
      case 'WATER':
        borderColor = '#6790f0';
        color = '#95d5d9';
        break;
      default:
        borderColor = 'black';
        color = 'black';
        break;
    }

    return { background: color, border: borderColor };
  };

  return (
    <div
      class="text-sm text-center shadow-sm font-mono font-bold rounded-sm text-[#FFFE] min-w-20 p-2 py-1 text-center border border-solid mr-1 h-8 flex items-center justify-center"
      style={{
        "background-color": colors().border,
        "border-color": colors().border,
      }}
    >
      <span
        style={{
          "width": fullWidth ? "100%" : "auto",
        }}
      >
        {typeName().toUpperCase()}
      </span>
    </div>
  );
}

export default PokemonType;
