function GamePicture({
  gameCode,
}) {
  let images;
  if (gameCode() === 0x0) {
    images = [
      '/game-images/ruby.png',
      '/game-images/sapphire.jpg',
    ];
  } else if (gameCode() === 0x1) {
    images = [
      '/game-images/fire-red.png',
      '/game-images/leaf-green.png',
    ];
  } else {
    images = [
      '/game-images/emerald.jpg',
    ];
  }

  const IMAGE_SIZE = 100;

  return (
    <div class="flex flex-row gap-1">
      {images.map((imageUrl) => {
        return (
          <img
            src={imageUrl}
            alt="game image"
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
          />
        );
      })}
    </div>
  );
}

export default GamePicture;
