const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const express = require("express");
const app = express();

app.use(express.json());

app.post("/text-completion", async (req, res) => {
    const {url, includeDetails} = req.body;

    try {
        const detailsOfSite = includeDetails ? `and give me the details, such as what languages and frameworks were using while building this site` : ''

        const PROMPT = `
            please summarize the following site,
            I will give you a url and I need a brief overview what this site is about:
            Here is the url: ${url} ${detailsOfSite}
        `

        const response = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: "text-davinci-003",
                prompt: `please summarize the following url: ${PROMPT}`,
                max_tokens: 1000,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_KEY}`,
                },
            }
        );

        const completion = response.data.choices[0].text;
        res.json({ completion });
    } catch (error) {
        res
            .status(500)
            .json({ error: "An error occurred while fetching completion." });
    }
});

app.listen(8080);