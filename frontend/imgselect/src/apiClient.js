export async function analyzeImageParts({ leftImage, rightImage, prompt }) {
  // No need to decode or convert — already in base64 DataURL format
  // Just strip the metadata prefix to keep only the base64 content
  const extractBase64 = (dataurl) => dataurl.split(',')[1];

  const payload = {
    image1: extractBase64(leftImage),  // base64-encoded PNG
    image2: extractBase64(rightImage), // base64-encoded PNG
    query: prompt
  };

  try {
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending image parts to API:", error);
    throw error;
  }
}
