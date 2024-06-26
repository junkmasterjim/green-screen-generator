"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { highestPercentage, sleep } from "@/lib/utils";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = ({ params }: { params: { id: string } }) => {
  const [prediction, setPrediction] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await axios.get(`api/replicate/${params.id}`);
        setPrediction(res.data.prediction);

        if (
          res.data.prediction.status !== "succeeded" &&
          res.data.prediction.status !== "failed"
        ) {
          // If not complete, wait 2000ms and then fetch again
          await sleep(2000);
          fetchPrediction(); // This line ensures we keep polling
          setPrediction(res.data.prediction);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching prediction:", error);
        toast.error("Sorry, something went wrong.");
        setIsLoading(false);
        setPrediction(null);
      }
    };

    fetchPrediction();

    // Cleanup function to prevent memory leaks
    return () => {
      // If you need to cancel any ongoing requests or timers, do it here
    };
  }, [params.id]);

  return (
    <section className="container p-6 flex flex-col gap-8 items-center justify-between text-center min-h-[80vh]">
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center text-center">
          {prediction !== null && (
            <>
              <h2 className="text-lg font-semibold tracking-tighter">
                prediction id:
              </h2>
              <p className="text-xs tracking-tight">{params.id}</p>
              <Button
                variant={"ghost"}
                className="h-auto py-2 leading=[1.1] mt-2"
                onClick={() => {
                  navigator.clipboard.writeText(
                    "https://greenscreengenerator.com/" + params.id,
                  );
                  toast.success("Copied url to clipboard!");
                }}
              >
                Copy link
              </Button>
            </>
          )}
          {prediction === null && (
            <div className="flex flex-col gap-2">
              <p className="text-xl font-semibold tracking-tight">
                Sorry, we couldn't find that one
              </p>
              <Link href={"/"}>
                <Button>Create a green screen</Button>
              </Link>
            </div>
          )}
        </div>
        {prediction && prediction.input.input_video && (
          <div className="flex items-center justify-center flex-col gap-2">
            <h2 className="font-semibold tracking-tighter text-3xl">
              Your input:
            </h2>
            <video
              id="input-video"
              className="h-64 w-auto rounded-lg object-cover"
              controls
              src={prediction.input.input_video}
            />
          </div>
        )}
        {isLoading && prediction && (
          <div className="text-sm tracking-tight space-y-1 text-muted-foreground">
            <p>Status: {prediction && prediction.status}</p>
            <p>
              Loading...{" "}
              {(prediction &&
                prediction.logs &&
                highestPercentage(prediction.logs)) ||
                0}
              %
            </p>
            <Progress
              className="h-2 w-full"
              value={highestPercentage(prediction.logs)}
            />
            <br />
            <br />
            <p>
              Feel free to refresh this page or check back in a couple minutes.
            </p>
          </div>
        )}
        {!isLoading && prediction && prediction.output && (
          <>
            {prediction.status === "failed" && <div>Something went wrong</div>}
            {prediction.status === "succeeded" && (
              <div className="flex items-center justify-center flex-col gap-2">
                <h2 className="font-semibold tracking-tighter text-3xl">
                  Output:
                </h2>
                <video
                  id="output-video"
                  className="h-64 w-auto rounded-lg object-cover"
                  controls
                  src={prediction.output}
                />
                <Link download={true} target="_blank" href={prediction.output}>
                  <Button>Download</Button>
                </Link>
              </div>
            )}
          </>
        )}
        {prediction && !prediction.output && !prediction.input.input_video && (
          <>
            <p className="tracking-tight leading-[1.2]">
              your green screen is no longer with us
              <br />
              screens are deleted after 1 hour for storage purposes
            </p>

            <Link href={"/"}>
              <Button>Return to home</Button>
            </Link>
          </>
        )}
      </div>

      <div className="text-sm tracking-tight leading-[1.2] text-muted-foreground">
        We use Replicate for green screen generation
        <br />
        Load times may depend on their servers
        <br />
        <br />
        Outputs are available for one hour by default.
      </div>
    </section>
  );
};

export default Page;
