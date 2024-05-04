import { useState } from "preact/hooks";
import { useTranscriber } from "../hooks/useTranscriber.ts";
import AudioPlayer from "../components/AudioPlayer.tsx";
import FileUpload from "../components/FileUpload.tsx";
import { Button } from "../components/Button.tsx";

export default function Transcribe() {
  const transcriber = useTranscriber();

  const [audioData, setAudioData] = useState<
    | {
      buffer: AudioBuffer;
      url: string;
      source: "FILE";
      mimeType: string;
    }
    | undefined
  >(undefined);

  const startTranscription = () => {
    if (audioData) {
      transcriber.start(audioData.buffer);
    } else {
      console.error("no audio data to transcribe");
    }
  };
  const restart = () => {
    // reload the pagge
    window.location.reload();
  };

  const saveBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };
  const exportTXT = () => {
    const text = transcriber?.output?.text || "";
    const blob = new Blob([text], { type: "text/plain" });
    saveBlob(blob, "transcript.txt");
  };

  return (
    <>
      <section class="controls">
        {transcriber.isBusy
          ? (
            <h2 class="text-4xl font-extrabold dark:text-white">
              Transcribing<span
                style={{ display: "inline-block", marginLeft: "0.5rem" }}
                class="dot-flashing"
              >
              </span>
            </h2>
          )
          : <h2 class="text-4xl font-extrabold dark:text-white">Transcribe</h2>}

        <div>
        </div>

        <div>
          <FileUpload
            onFileUpdate={(decoded, blobUrl, mimeType) => {
              setAudioData({
                buffer: decoded,
                url: blobUrl,
                source: "FILE",
                mimeType: mimeType,
              });
            }}
          />
        </div>
      </section>

      <hr class="my-8 border-t border-gray-300 mt-5 mb-5 mr-5 ml-5" />

      <section className="audio">
        {audioData && (
          <>
            <AudioPlayer
              audioUrl={audioData.url}
              mimeType={audioData.mimeType}
            />

            {!transcriber.isModelLoading && !transcriber.isBusy && (
              <div class="inline-block flex justify-center">
                <Button
                  text="Start Transcription"
                  onClick={startTranscription}
                />
              </div>
            )}
          </>
        )}
      </section>

      <section className="text">
        <div>
          {transcriber?.output?.text}
        </div>
        <div class="block mt-10">
          {transcriber?.output?.text && (
            <Button
              text="Download TXT"
              onClick={exportTXT}
            />
          )}
        </div>

        <div class="block mt-10">
          {transcriber?.output?.text && (
            <Button
              text="Restart"
              onClick={restart}
            />
          )}
        </div>
      </section>
    </>
  );
}
