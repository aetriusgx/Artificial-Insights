const MultiplexAI = require('./api');

async function main() {
	let call = new MultiplexAI({
		// gpt4: true,
		gpt35: true,
		gemini: true,
		claude_opus: true
	});

	call.RequestAIWithPrompt('can the end of a rainbow be found?');
}

main();
