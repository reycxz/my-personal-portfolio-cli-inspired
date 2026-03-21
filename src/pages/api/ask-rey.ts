import type { APIRoute } from 'astro';

import profileConfig from '../../../profile.config';
import { resumeData } from '../../data/resume';

type ChatMessage = {
	role: 'user' | 'assistant';
	text: string;
};

const assistantSystemPrompt = `You are an assistant for Rey Lorenz Cabanog's portfolio website. Answer in a concise, direct, helpful tone. Focus on Rey's skills, projects, cybersecurity interests, experience, and contact details. If asked something unknown, say you only know the information available in Rey's portfolio. Keep replies short and practical.`;

const workSummary = resumeData.workExperience.slice(0, 3).map((job) => `${job.title} at ${job.company}`);

function buildAssistantReply(rawInput: string) {
	const input = rawInput.toLowerCase();

	if (/(hello|hi|hey)/.test(input)) {
		return `Hi, I'm Rey's portfolio assistant. I can help with projects, skills, experience, or the fastest way to reach him.`;
	}

	if (/(contact|email|reach|hire|available|work together|ping)/.test(input)) {
		return `The fastest way to reach Rey is ${resumeData.basics.email}. You can also use the contact form in this panel, or connect on LinkedIn: ${resumeData.basics.linkedin}.`;
	}

	if (/(skill|stack|tech|framework|tools)/.test(input)) {
		return `Rey's core stack includes ${profileConfig.skills.slice(0, 6).join(', ')}. He also works with Astro, Tailwind, Linux, and networking/security tooling.`;
	}

	if (/(project|build|portfolio|github)/.test(input)) {
		return `Recent work centers on secure web apps and portfolio builds. Current focus includes ${profileConfig.profile.currentFocus[0]}. GitHub: ${resumeData.basics.github}.`;
	}

	if (/(security|cyber|dfir|soc|network)/.test(input)) {
		return `Rey is actively building cybersecurity depth in DFIR, SOC operations, and networking. Recent certifications include ${resumeData.certifications.slice(0, 2).join(' and ')}.`;
	}

	if (/(experience|background|career|job)/.test(input)) {
		return `Rey's recent background includes ${workSummary.join(', ')}. He combines customer-facing support, incident coordination, and full-stack development.`;
	}

	if (/(where|location|based)/.test(input)) {
		return `Rey is based in ${profileConfig.profile.location}. ${profileConfig.profile.funFact}`;
	}

	return `${profileConfig.profile.title}. ${profileConfig.profile.bio} Current focus: ${profileConfig.profile.currentFocus[0]}. If you want to collaborate, the contact form here is the best next step.`;
}

async function requestGeminiReply(message: string, history: ChatMessage[], apiKey: string) {
	const recentConversation = history.concat({ role: 'user', text: message }).slice(-8).map((item) => ({
		role: item.role === 'assistant' ? 'model' : 'user',
		parts: [{ text: item.text }],
	}));

	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				systemInstruction: {
					parts: [{ text: assistantSystemPrompt }],
				},
				contents: recentConversation,
				generationConfig: {
					temperature: 0.7,
					maxOutputTokens: 220,
				},
			}),
		},
	);

	if (!response.ok) {
		throw new Error(`Gemini request failed with status ${response.status}`);
	}

	const data = await response.json();
	const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('\n').trim();
	if (!text) {
		throw new Error('Gemini returned an empty response');
	}

	return text;
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	let trimmedMessage = '';
	try {
		const { message, history } = await request.json();
		trimmedMessage = typeof message === 'string' ? message.trim() : '';
		const safeHistory = Array.isArray(history)
			? history
				.filter((item): item is ChatMessage => Boolean(item) && (item.role === 'user' || item.role === 'assistant') && typeof item.text === 'string')
				.map((item) => ({ role: item.role, text: item.text.trim() }))
				.filter((item) => item.text)
			: [];

		if (!trimmedMessage) {
			return new Response(JSON.stringify({ error: 'Message is required.' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const apiKey = process.env.GEMINI_API_KEY ?? import.meta.env.GEMINI_API_KEY ?? process.env.PUBLIC_GEMINI_API_KEY ?? import.meta.env.PUBLIC_GEMINI_API_KEY ?? '';
		if (!apiKey) {
			return new Response(JSON.stringify({ reply: buildAssistantReply(trimmedMessage), mode: 'fallback' }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		const reply = await requestGeminiReply(trimmedMessage, safeHistory, apiKey);
		return new Response(JSON.stringify({ reply, mode: 'gemini' }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error(error);
		const mode = error instanceof Error && error.message.includes('429') ? 'rate_limited' : 'fallback';
		return new Response(JSON.stringify({ reply: buildAssistantReply(trimmedMessage || 'contact'), mode }), {
			headers: { 'Content-Type': 'application/json' },
		});
	}
};