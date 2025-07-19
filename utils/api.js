const BASE_URL = "https://95bcc019821b.ngrok-free.app"; // ✅ your correct IP

export async function sendIdTokenToBackend(idToken) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/firebase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    console.log("Response status:", res.status);
    const contentType = res.headers.get("content-type");
    console.log("Content-Type:", contentType);

    const responseText = await res.text();
    console.log("Raw response text:", responseText);

    // If it's JSON, then parse
    if (contentType && contentType.includes("application/json")) {
      const data = JSON.parse(responseText);
      console.log("Parsed JSON:", data);
    } else {
      console.warn("Response is not JSON, skipping parse.");
    }

  } catch (err) {
    console.error("🔥 Error in sendIdTokenToBackend:", err);
  }
}