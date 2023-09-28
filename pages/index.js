import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [dateInput, setDateInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea: dateInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setDateInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/cute_chatbot.jpg" className={styles.icon} />
        <h3>Data Ventures - Date Idea Generator</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="dateIdea"
            placeholder="Let me know your date idea"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
          />
          <input type="submit" value="Generate Date Ideas" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>    
  );
}
