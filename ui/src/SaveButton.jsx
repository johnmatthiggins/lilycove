import { bytesToBase64 } from './utils/hex.jsx';
import Button from './Button';

function SaveButton({ bits, trainerOffset }) {
  return (
    <Button
      class="py-1 px-2 rounded-md text-md w-32"
      onClick={() => {
        const saveData = bits();
        if (trainerOffset() >= 0xE000) {
          for (let i = 0; i < 0xE000; i += 1) {
            saveData[i] = saveData[0xE000 + i];
          }
        } else {
          for (let i = 0; i < 0xE000; i += 1) {
            saveData[0xE000 + i] = saveData[i];
          }
        }

        const bytes = new Uint8Array(bits());
        let b64 = bytesToBase64(bytes);
        const dataUrl = `data:application/octet-stream;base64,${b64}`;
        const anchor = document.createElement('a')
        anchor.href = dataUrl;
        anchor.download = '*.sav';
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      }}
    >
      Download
    </Button>
  );
}

export default SaveButton;
