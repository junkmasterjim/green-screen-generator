"use client";

import axios from "axios";
import { UploadDropzone } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const handleUpload = async (res: any) => {
    await axios
      .post("/api/replicate", { file: res[0].url })
      .then(async (response) => {
        if (response.status !== 201) {
          console.error("Error: ", { response });
        }
        let prediction = response.data.output;

        if (prediction.status === "failed") {
          console.error(prediction.detail);
        } else router.push("/" + prediction.id);
      })
      .catch((e) => console.error(e));
  };

  return (
    <>
      <div className="container min-h-[80vh]">
        <div className="flex h-full flex-col justify-center items-center min-h-96 p-6">
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={handleUpload}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
