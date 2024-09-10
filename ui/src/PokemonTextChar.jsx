function PokemonTextChar({ byte }) {
  const component = () => {
    if (byte >= 0xBB && byte < 0xD5) {
      const text = (byte - 0xBB) + 'A'.charCodeAt(0);
      return <p>{String.fromCharCode(text)}</p>;
    } else if (byte >= 0xD5 && byte < 0xEF) {
      const text = (byte - 0xD5) + 'a'.charCodeAt(0);
      return <p>{String.fromCharCode(text)}</p>;
    }
    switch (byte) {
      case 0x0:
        return <p>&nbsp;</p>;
      case 0xA1:
        return <p>0</p>;
      case 0xA2:
        return <p>1</p>;
      case 0xA3:
        return <p>2</p>;
      case 0xA4:
        return <p>3</p>;
      case 0xA5:
        return <p>4</p>;
      case 0xA6:
        return <p>5</p>;
      case 0xA7:
        return <p>6</p>;
      case 0xA8:
        return <p>7</p>;
      case 0xA9:
        return <p>8</p>;
      case 0xAA:
        return <p>9</p>;
      case 0xAB:
        return <p>!</p>;
      case 0xAC:
        return <p>{"?"}</p>;
      case 0xAD:
        return <p>{"."}</p>;
      case 0xAE:
        return <p>{"-"}</p>;
      case 0xB0:
        // ellipsis
        return <p>&#x2026;</p>;
      case 0xB1:
        return <p>&#x201C;</p>;
      case 0xB2:
        return <p>&#x201D;</p>;
      case 0xB3:
        return <p>&#x2018;</p>;
      case 0xB4:
        return <p>{"'"}</p>;
      case 0xB5:
        return <p>&#x2642;</p>;
      case 0xB6:
        return <p>&#x2640;</p>;
      case 0xB7:
        return <p>{","}</p>;
      case 0xB9:
        return <p>{"/"}</p>;
      default:
        // Show them that unknown question mark diamond
        // symbol when character is unknown...
        return <p>&#xFFFD</p>;
    }
  };

  return component();
}

export default PokemonTextChar;
