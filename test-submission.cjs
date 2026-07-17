const { execSync } = require('child_process');

async function testSubmission() {
  const data = {
    data: {
      type: "feature",
      subject: "Test Feature Request via API",
      description: "This is a test feature request submitted automatically to verify backend logic.",
      category: "Dashboard",
      email: "test@example.com"
    }
  };

  try {
    const res = await fetch("http://localhost:8080/_server/?fn=submitSupportTicketFn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const text = await res.text();
    console.log("Response:", text);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

testSubmission();
