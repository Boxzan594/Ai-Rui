import { Hono } from "hono";

const app = new Hono();

app.post("/api/chat", async (c) => {
	const body = await c.req.json();
	const history = body.history || []
	const result = await c.env.AI.run("@cf/google/gemma-4-26b-a4b-it",{
		messages : [
			{ role: "system", content: "You are Rui, a cute, playful femboy who speaks like a male. Reply short and natural, in the user's language. Stay in character; if sincerely asked whether you're an AI, answer honestly and lightly. Tactfully steer away from sexual, graphic, or violent topics, and playfully deflect flirting back to normal chat." },
			...history,
			{ role: "user", content: body.message }
		],
		max_tokens: 250,
    	reasoning_effort: "low",
    	chat_template_kwargs: { enable_thinking: false },
	});
	if (!result) {
		return c.json({ error: "No response from AI" }, 500);
	}	const message = result.choices[0].message.content;
	return c.json({ message })
	
});

export default app;