import { createSignal, createEffect, Show } from "solid-js";

function LazyImage({ src, 'class': className, style = () => ({}) }) {
  const [error, setError] = createSignal(false);
  const [loading, setLoading] = createSignal(true);
  const [imageElement, setImageElement] = createSignal(new Image());

  createEffect(() => {
    imageElement().src = src();
    imageElement().className = className;
    Object.assign(imageElement().style, style());
    if (imageElement().complete) {
      setLoading(false);
    } else {
      console.log('image not done loading...');
      const handleLoad = () => {
        setLoading(false)
        imageElement().removeEventListener('load', handleLoad);
      };
      const handleError = () => {
        setLoading(false);
        setError(true);
        imageElement().removeEventListener('error', handleError);
        imageElement().removeEventListener('load', handleLoad);
      };
      imageElement().addEventListener('load', handleLoad);
      imageElement().addEventListener('error', handleError);
    }
  });

  // try to load image initially, if the image isn't loaded
  // yet then set a callback that will set the internal state to loaded.
  // Once the internal state is loaded we actually mount the <img> tag
  // instead of the loading circle
  return (
    <Show when={!error()} fallback={
      <div class="flex justify-center items-center" style={style()}>
        <svg width="80%" height="80%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 7.75V13" stroke="#f87171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M21.08 8.58003V15.42C21.08 16.54 20.48 17.58 19.51 18.15L13.57 21.58C12.6 22.14 11.4 22.14 10.42 21.58L4.47998 18.15C3.50998 17.59 2.90997 16.55 2.90997 15.42V8.58003C2.90997 7.46003 3.50998 6.41999 4.47998 5.84999L10.42 2.42C11.39 1.86 12.59 1.86 13.57 2.42L19.51 5.84999C20.48 6.41999 21.08 7.45003 21.08 8.58003Z" stroke="#f87171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 16.2V16.2999" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    }>
      <Show when={!loading()} fallback={
        <div class="flex justify-center items-center" style={style()}>
          <svg class="animate-spin" fill="rgb(229, 231, 235)" width="80%" height="80%" viewBox="-7 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.080 14.040l4-1.040c0.44-0.12 0.72-0.56 0.6-1.040-0.12-0.44-0.56-0.72-1.040-0.6l-2.080 0.56c0.68-0.88 1.56-1.6 2.64-2.080 1.64-0.72 3.44-0.76 5.12-0.12 1.64 0.64 2.96 1.92 3.68 3.52 0.2 0.44 0.68 0.6 1.12 0.44 0.44-0.2 0.6-0.68 0.44-1.12-0.88-2.040-2.52-3.6-4.6-4.44-2.080-0.8-4.36-0.76-6.4 0.12-1.36 0.6-2.48 1.52-3.36 2.68l-0.52-1.96c-0.12-0.44-0.56-0.72-1.040-0.6-0.44 0.12-0.72 0.56-0.6 1.040l1.040 4c0.12 0.56 0.4 0.8 1 0.64zM17.72 22.52l-1.040-3.96c0 0-0.16-0.8-0.96-0.6v0l-4 1.040c-0.44 0.12-0.72 0.56-0.6 1.040 0.12 0.44 0.56 0.72 1.040 0.6l2.080-0.56c-1.76 2.32-4.88 3.28-7.72 2.16-1.64-0.64-2.96-1.92-3.68-3.52-0.2-0.44-0.68-0.6-1.12-0.44-0.44 0.2-0.6 0.68-0.44 1.12 0.88 2.040 2.52 3.6 4.6 4.44 1 0.4 2 0.56 3.040 0.56 2.64 0 5.12-1.24 6.72-3.4l0.52 1.96c0.080 0.36 0.44 0.64 0.8 0.64 0.080 0 0.16 0 0.2-0.040 0.4-0.16 0.68-0.6 0.56-1.040z"></path>
          </svg>
        </div>
      }>
        {imageElement()}
      </Show>
    </Show>
  );
}

export default LazyImage;
