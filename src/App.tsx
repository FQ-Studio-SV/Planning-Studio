import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { GeminiTestPanel } from "./components/GeminiTestPanel";
import { GoogleGenAI } from "@google/genai";
import { getGeminiConfig } from "./config/environment";

function App() {
	const [count, setCount] = useState(0);

	const ai = new GoogleGenAI({ apiKey: getGeminiConfig().apiKey });

  

	async function main() {
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: "Why is the sky blue?",
		});
		console.log(response.text);
	}

	return (
		<>
			<GeminiTestPanel />
			<div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => main()}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
