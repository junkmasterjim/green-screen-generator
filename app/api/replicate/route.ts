import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
	auth: process.env.REPLICATE_API_TOKEN,
});

export const POST = async (req: NextRequest) => {
	const { file } = await req.json();
	try {
		const output = await replicate.predictions.create({
			version:
				"73d2128a371922d5d1abf0712a1d974be0e4e2358cc1218e4e34714767232bac",
			input: {
				input_video: file,
				output_type: "green-screen",
			},
		});

		console.log({ output });

		return new Response(JSON.stringify({ output }), {
			status: 201,
			statusText: "Created",
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (e) {
		console.log(e);

		return new Response(JSON.stringify({ e }), {
			status: 500,
			statusText: "Internal Server Error in api/replicate/",
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
};
