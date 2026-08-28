import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json({
    limit: "10mb"
}));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// ==================================
// HEALTH CHECK
// ==================================

app.get("/", (req, res) => {

    res.json({
        status: "online",
        bot: "MAICHAT",
        version: "1.0.0"
    });

});

// ==================================
// CHAT ENDPOINT
// ==================================

app.post("/chat", async (req, res) => {

    try {

        const { message } = req.body;

        if (!message) {

            return res.status(400).json({
                success: false,
                error: "Message required"
            });

        }

        const completion =
            await groq.chat.completions.create({

                model:
                    "llama-3.3-70b-versatile",

                messages: [
                    {
                        role: "system",
                        content:
`You are MAICHAT, a premium AI assistant.
You are intelligent, helpful, friendly and accurate.`
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],

                temperature: 0.7,
                max_tokens: 2048

            });

        const reply =
            completion.choices[0]
                .message.content;

        res.json({

            success: true,
            reply

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            error: "AI request failed"

        });

    }

});

// ==================================
// START SERVER
// ==================================

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `MAICHAT running on port ${PORT}`
    );

});
