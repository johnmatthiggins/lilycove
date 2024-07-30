import styles from './App.module.css';
import { createSignal } from 'solid-js';

function App() {
  const [buffer, setBuffer] = createSignal([]);
  const [bits, setBits] = createSignal('');

  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <div class="rounded-lg bg-cyan-200 w-64">
          <h3 class="text-3xl">Lilycove City</h3>
          <h2 class="text-2xl">A Generation III Hex Editor</h2>
          <input
            type="file"
            onChange={async (e) => {
              const file = e.target.files[0];
              const bytes = await file.bytes();
              setBuffer(bytes);
              const hexBytes = bytes.map((byte, i) => {
                const hex = byte.toString(16);
                if (i % 8 === 0) {
                  console.log('newline');
                  if (hex.length < 2) {
                    return '0' + hex + '\r\n';
                  }
                  return hex + '\r\n';
                } else {
                  if (hex.length < 2) {
                    return '0' + hex;
                  }
                  return hex;
                }
              });
              setBits(hexBytes.join(" "));
            }} />
          <pre class="break-words text-black whitespace-pre">{bits()}</pre>
        </div>
      </header>
    </div>
  );
}

export default App;
