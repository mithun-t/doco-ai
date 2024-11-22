import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    age: "",
    visitDate: "",
    diagnosis: "",
  });
  const [patientVisits, setPatientVisits] = useState([]);

  // Load saved patient visits from local storage
  useEffect(() => {
    const savedVisits = JSON.parse(localStorage.getItem("patientVisits")) || [];
    setPatientVisits(savedVisits);
  }, []);

  // Save visit to local storage
  const saveVisit = () => {
    const updatedVisits = [...patientVisits, patientDetails];
    setPatientVisits(updatedVisits);
    localStorage.setItem("patientVisits", JSON.stringify(updatedVisits));
    setPatientDetails({ name: "", age: "", visitDate: "", diagnosis: "" });
  };

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
            content: `Based on the patient data: ${JSON.stringify(
              patientVisits
            )}, ${message}`,
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
      <h2>Doctor Assistant Chat</h2>

      {/* Patient Visit Entry Form */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Enter Patient Visit Details</h2>
        <input
          type="text"
          placeholder="Patient Name"
          value={patientDetails.name}
          onChange={(e) =>
            setPatientDetails({ ...patientDetails, name: e.target.value })
          }
        />
        <br />
        <input
          type="number"
          placeholder="Age"
          value={patientDetails.age}
          onChange={(e) =>
            setPatientDetails({ ...patientDetails, age: e.target.value })
          }
        />
        <br />
        <input
          type="date"
          placeholder="Visit Date"
          value={patientDetails.visitDate}
          onChange={(e) =>
            setPatientDetails({ ...patientDetails, visitDate: e.target.value })
          }
        />
        <br />
        <textarea
          rows="2"
          cols="50"
          placeholder="Diagnosis"
          value={patientDetails.diagnosis}
          onChange={(e) =>
            setPatientDetails({ ...patientDetails, diagnosis: e.target.value })
          }
        />
        <br />
        <button onClick={saveVisit}>Save Visit</button>
      </div>

      {/* Patient Visits */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Saved Patient Visits</h2>
        <ul>
          {patientVisits.map((visit, index) => (
            <li key={index}>
              {visit.name}, Age: {visit.age}, Date: {visit.visitDate},
              Diagnosis: {visit.diagnosis}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Functionality */}
      <textarea
        rows="4"
        cols="50"
        placeholder="Ask something about patient data..."
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
