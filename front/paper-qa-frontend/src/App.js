import React, { useState } from "react";


function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }
    setFile(selectedFile);
    console.log("File selected:", selectedFile); 
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
    console.log("Question updated:", event.target.value); 
  };

  const handleSubmit = async () => {
    if (!file || !question) {
      alert("Please upload a paper and enter a question.");
      console.log("Validation failed: file or question missing."); 
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("pdf", file); 
    formData.append("question", question);

    try {
      console.log("Submitting to API..."); 
      const response = await fetch("http://127.0.0.1:8000/api/query/", {
        method: "POST",
        body: formData,
      });

      console.log("API Response:", response.status); 

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data); 
      setAnswer(data.response || "No answer available."); 
    } catch (error) {
      console.error("Error submitting paper:", error); 
      alert("There was an error submitting the paper.");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center  p-10"
      style={{ backgroundImage: `url('valley.png')` }}
    >

<div className="w-full flex mt-0 justify-center">
        <img
          src="/logovalley.png" 
          alt="Uploaded Preview"
          className="max-w-full max-h-16 object-contain"
        />
      </div>


      <div className="flex flex-col bg-transparent items-left justify-center items-center mt-1 h-full text-gray-800 px-4 py-8">
        <div className="bg-transparent p-10 rounded-lg shadow backdrop-blur w-2/5 bg-primarylightblue/30">
          <h1 className="text-2xl font-bold text-center mb-4 text-primaryblue">
            Upload a Paper & Ask a Question
          </h1>

          <div className="mt-10">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 bg-primarywhite shadow rounded-md placeholder:text-primaryblue"
            />
          </div>

          <div className="mt-5">
            <input
              type="text"
              placeholder="Ask a question..."
              value={question}
              onChange={handleQuestionChange}
              className="w-full p-2 text-primaryblue shadow rounded-md outline-none placeholder:text-primaryblue"
            />
            

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full p-2 text-primaryblue shadow rounded-md outline-none placeholder:text-primaryblue ${
              loading && "opacity-50"
            }`}
          >
            {loading ? "Processing..." : "Submit"}
          </button>

          </div>

          {answer && (
            <div className="mt-3 bg-gray-100 p-4 rounded-md shadow-md">
              <h3 className="font-bold mb-2">Answer:</h3>
              <p>{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
