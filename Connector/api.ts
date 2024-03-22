import Anthropic from '@anthropic-ai/sdk'
import GoogleGenerativeAI from '@google/generative-ai'
import 'dotenv/config'
import OpenAI from 'openai'

// Preferred approach is to have dropdowns for each of the bots.
// Each of those dropdowns will have a Config object attached
// When a configuration is done. The info from the dropdown Configs will compile into one ModelConfig

declare enum SupportedGPTModels {
	latest35 = 'gpt-3.5-turbo',
	latest4 = 'gpt-4-0125-preview',
	base = 'babbage-002'
}

declare enum SupportedGeminiModels {
	latest = 'gemini-latest'
}

declare enum SupportedAnthropicModels {
	opus = 'claude-3-opus-20240229'
}

export declare interface GPTConfig {
	latest35?: boolean;
	latest4?: boolean;
	legacy?: boolean;
}

export declare interface ClaudeConfig {
	opus?: boolean;
}

export declare interface GeminiConfig {
	latest?: boolean;
}

export declare interface ModelConfig {
	gpt_models?: GPTConfig;
	claude_models?: ClaudeConfig;
	gemini_models?: GeminiConfig;
}

interface PromptResponse {
	model?: String;
	input?: {
		content: String,
		tokens: Number
	};
	output?: {
		content?: String,
		tokens?: Number
	};
	duration?: Number;
}

export declare interface MultiplexResponse {
	response: PromptResponse;
}

export class MultiplexRequest {


	constructor(modelConfig: ModelConfig) {

	}

	public async Prompt(prompt: String): Promise<PromptResponse[]> {
		let responses: PromptResponse[] = [];

		return responses;
	}

	private async GenerateGPTResponse(prompt): Promise<PromptResponse[]> {
		let res: PromptResponse = {};

		// start gpt loop body
		let start_time = Date.now();

		// send request

		let end_time = Date.now();
		res.duration = end_time - start_time;
		// end gpt loop body

		return [res];
	}
}
