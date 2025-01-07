import LazyImage from "./LazyImage";

function TrainerImage({ isFemale, gameCode, 'class': className = '' }) {
  const imagePath = () => {
    let trainerImage;
    if (gameCode() === 'rs') {
      if (isFemale()) {
        trainerImage = 'trainer_may_rs.png';
      } else {
        trainerImage = 'trainer_brendan_rs.png';
      }
    } else if (gameCode() === 'frlg') {
      if (isFemale()) {
        trainerImage = 'trainer_leaf.png';
      } else {
        trainerImage = 'trainer_red.png';
      }
    } else {
      if (isFemale()) {
        trainerImage = 'trainer_may_e.png';
      } else {
        trainerImage = 'trainer_brendan_e.png';
      }
    }
    return "/static/" + trainerImage;
  };

  return <LazyImage sharp src={imagePath} class={className} />
}

export default TrainerImage;
