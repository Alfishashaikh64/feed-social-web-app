export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?count=9&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Failed to fetch images from Unsplash",
      });
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Unsplash API error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}