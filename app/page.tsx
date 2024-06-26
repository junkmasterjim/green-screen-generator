"use client";

import axios from "axios";
import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { highestPercentage, sleep } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [file, setFile] = useState<string>("");
  const [green, setGreen] = useState<string>("");
  const [loadingPercent, setLoadingPercent] = useState<number>();

  const handleUpload = async (res: any) => {
    setFile(res[0].url);

    await axios
      .post("/api/replicate", { file: res[0].url })
      .then(async (response) => {
        if (response.status !== 201) {
          console.error("Error: ", { response });
        }
        let prediction = response.data.output;

        while (
          prediction.status !== "succeeded" &&
          prediction.status !== "failed"
        ) {
          await sleep(5000);

          await axios.get("/api/replicate/" + prediction.id).then((r) => {
            console.log(r.data);

            if (r.data.prediction.logs) {
              setLoadingPercent(highestPercentage(r.data.prediction.logs));
            }

            prediction = r.data.prediction;
          });
        }

        if (prediction.status === "failed") {
          console.error(prediction.detail);
        } else if (prediction.status === "succeeded") {
          setGreen(prediction.output);
        }
      })
      .catch((e) => console.error(e));
  };

  return (
    <>
      <div className="container h-[80vh]">
        <div className="flex items-center justify-between py-4">
          <span className="text-xl font-bold tracking-tighter leading-[1.1]">
            Green Screen Generator
          </span>
          <p className="text-sm text-muted-foreground">
            Made with 🥩 by Noah Pittman
          </p>
        </div>

        <div className="flex h-full flex-col justify-center items-center min-h-96 p-6">
          {!file && (
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={handleUpload}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
          )}

          <div className="flex items-center flex-col justify-center gap-8">
            {file && (
              <>
                <video
                  id="video"
                  className="h-64 w-auto rounded-lg object-cover"
                  controls
                  src={file}
                />
                {green ? (
                  <>
                    <video
                      id="green"
                      className="h-64 w-auto rounded-lg object-cover"
                      controls
                      src={green}
                    />
                    <Button
                      onClick={() => {
                        setFile("");
                        setGreen("");
                      }}
                    >
                      Reset
                    </Button>
                  </>
                ) : (
                  <div className="*:w-full space-y-1">
                    <p className="text-muted-foreground text-center animate-pulse">
                      Generating green screen... Do not refresh this page.
                    </p>
                    <p className="text-sm text-center text-muted-foreground/75">
                      It might take 2-3 minutes to generate the video.
                    </p>
                    <p className="text-muted-foreground/75 text-center text-sm">
                      {loadingPercent
                        ? loadingPercent + "%"
                        : "Model is starting up, loading percentage will be displayed shortly"}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="h-full flex items-end justify-center text-center text-sm text-muted-foreground/75">
            <p>
              This app uses Replicate as an API service. Load times depend on
              their servers.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
