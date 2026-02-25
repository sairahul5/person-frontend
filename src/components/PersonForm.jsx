import { useState } from "react";

function PersonForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !age) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/person`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            age: parseInt(age),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      const data = await response.json();

      setMessage("Saved successfully: " + data.name);
      setName("");
      setAge("");
    } catch (error) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="container">
      <h2>Add Person</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default PersonForm;

