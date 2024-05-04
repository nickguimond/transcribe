import { IS_BROWSER } from "$fresh/runtime.ts";
import { Button } from "./Button.tsx";

interface FileUploadProps {
  onFileUpdate: (
    decoded: AudioBuffer,
    blobUrl: string,
    mimeType: string,
  ) => void;
}

export default function FileUpload(props: FileUploadProps) {
  if (!IS_BROWSER) {
    return null;
  }
  // Create hidden input element
  const elem = document.createElement("input");
  const onClick = () => {
    elem.click();
  };
  elem.type = "file";
  elem.oninput = (event) => {
    // Make sure we have files to use
    const files = (event.target as HTMLInputElement).files;
    if (!files) return;

    // Create a blob that we can use as an src for our audio element
    const urlObj = URL.createObjectURL(files[0]);
    const mimeType = files[0].type;

    const reader = new FileReader();
    reader.addEventListener("load", async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (!arrayBuffer) return;

      const audioCTX = new AudioContext({
        sampleRate: 16000,
      });

      const decoded = await audioCTX.decodeAudioData(arrayBuffer);

      props.onFileUpdate(decoded, urlObj, mimeType);
    });
    reader.readAsArrayBuffer(files[0]);

    // Reset files
    elem.value = "";
  };

  return (
    <Button
      text="Upload File"
      onClick={onClick}
    />
  );
}
