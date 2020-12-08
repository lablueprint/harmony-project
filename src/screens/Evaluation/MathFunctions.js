/**
   * Returns a string in MM:SS form
   * @param {Number} totalSeconds The timestamp in seconds
   */
export function convertToMinSec(totalSeconds) {
  let seconds = totalSeconds % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${seconds}`;
}

export function yum() {

}
