const { default: OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Anthropic } = require('@anthropic-ai/sdk');
require('dotenv').config();

const secret = process.env.CHAT_KEY;

module.exports = class MultiplexAI {
	Models = {
		gpt: {
			'gpt-4': null,			// Currently points to gpt-4-0613
			'gpt-3.5-turbo': null, 	/** Currently points to gpt-3.5-turbo-0125.
									*	The latest GPT-3.5 Turbo model with higher accuracy at responding
									*	in requested formats and a fix for a bug which caused a text 
									*	encoding issue for non-English language function calls. 
									*	Returns a maximum of 4,096 output tokens			*/
			'babbage-002': null,	// Replacement for the GPT-3 ada and babbage base models.
		},
		gemini: {
			'gemini-latest': null,
		},
		anthropic: {
			'claude-3-opus': null,
		}
	}

	constructor(options = {}) {
		if (options.gpt4 !== undefined && options.gpt4 == true) {
			this.Models.gpt['gpt-4-0125-preview'] = new OpenAI(
				{ apiKey: process.env.CHAT_4_KEY }
			);
		}
		if (options.gpt35 !== undefined && options.gpt35 == true) {
			this.Models.gpt['gpt-3.5-turbo'] = new OpenAI(
				{ apiKey: secret }
			);
		}
		if (options.base !== undefined && options.base == true) {
			this.Models.gpt['babbage-002'] = new OpenAI(
				{ apiKey: secret }
			);
		}
		if (options.gemini !== undefined && options.gemini == true) {
			this.Models.gemini['gemini-latest'] = new GoogleGenerativeAI(process.env.GEMINI_KEY).getGenerativeModel({ model: 'gemini-pro' });
		}
		if (options.claude_opus !== undefined && options.claude_opus == true) {
			this.Models.anthropic['claude-3-opus-20240229'] = new Anthropic({ apiKey: process.env.CLAUDE_KEY });
		}
	}

	async RequestAIWithPrompt(prompt) {
		await this.RequestGPT(prompt);
		await this.RequestGemini(prompt);
		await this.RequestAnthropic(prompt);
	}

	async RequestGPT(prompt) {
		for (let model in this.Models.gpt) {
			if (this.Models.gpt[model] !== null) {
				const stream = await this.Models.gpt[model].chat.completions.create({
					model: model,
					messages: [{
						role: "user",
						content: `${prompt}`
					}],
					stream: true,
				});

				process.stdout.write(`${model}: `);
				for await (const chunk of stream) {
					process.stdout.write(chunk.choices[0]?.delta?.content || "\n");
				}
			}
		}
	}

	async RequestGemini(prompt) {
		for (let model in this.Models.gemini) {
			if (this.Models.gemini[model] !== null) {
				const request = await this.Models.gemini[model].generateContentStream(prompt);

				process.stdout.write(`${model}: `);
				for await (const chunk of request.stream) {
					const textChunk = chunk.text();
					process.stdout.write(textChunk || "\n");
				}
			}
		}
	}

	async RequestAnthropic(prompt) {
		for (let model in this.Models.anthropic) {
			if (this.Models.anthropic[model] !== null) {
				process.stdout.write(`${model}: `);
				await this.Models.anthropic[model].messages.stream({
					messages: [{ 'role': 'user', 'content': prompt }],
					model: model,
					max_tokens: 1024
				}).on('text', (text) => {
					process.stdout.write(text);
				});
			}
		}
	}
}