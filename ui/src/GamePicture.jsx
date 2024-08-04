function GamePicture({ gameCode }) {
  let images;
  let title;
  if (gameCode() === 0x0) {
    images = [
      '/game-images/ruby.png',
      '/game-images/sapphire.jpg',
    ];
    title = "Pokemon: Ruby & Sapphire"
  } else if (gameCode() === 0x1) {
    images = [
      '/game-images/fire-red.png',
      '/game-images/leaf-green.png',
    ];
    title = "Pokemon: Fire Red & Leaf Green"
  } else {
    images = [
      '/game-images/emerald.jpg',
    ];
    title = "Pokemon: Emerald"
  }

  const IMAGE_SIZE = 100;

  return (
    <div>
      <h3 class="text-2xl font-bold">{title}</h3>
      <div class="flex flex-row gap-1 justify-center">
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
    </div>
  );
}

export default GamePicture;
