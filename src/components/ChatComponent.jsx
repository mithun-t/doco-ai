import React, { useState } from "react";
import axios from "axios";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message) {
      setError("Message cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    const options = {
      method: "POST",
      url: "https://chatgpt-42.p.rapidapi.com/conversationllama3",
      headers: {
        "x-rapidapi-key": "8b3794ddb1msh97fb1a307bd5b83p1c2625jsn58f5c00c04d3",
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        web_access: false,
      },
    };
    try {
      const response = await axios.request(options);
      console.log(response);
      setResponse(response.data.result || "No response from API");
    } catch (err) {
      setError("Failed to fetch response from the API.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      {/* <h1>Doctor Assistant Chat</h1> */}
      <textarea
        rows="4"
        cols="50"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginBottom: "10px", padding: "10px" }}
      />
      <br />
      <button onClick={handleSendMessage} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
      <div style={{ marginTop: "20px" }}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {response && (
          <div style={{ border: "1px solid #ccc", padding: "10px" }}>
            <h3>Response:</h3>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
