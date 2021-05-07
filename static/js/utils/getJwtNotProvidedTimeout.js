export default function getJwtNotProvidedTimeout () {
  return setTimeout(() => {
    console.warn(
      'A JWT has not been received within 5 seconds of page load, and "useJWT" is set to true.\n' + 
      'Load the experience by calling initAnswersFrameJWT(token).'
    );
  }, 5000);
}