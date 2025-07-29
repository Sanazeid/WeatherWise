import express from "express";
import axios from "axios";
const app = express();
const PORT = 3000;

const API_KEY = "e4008ec11a9e56878e9901ded106dedb";

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs", { weather: null, tip: null, error: null });
});

app.post("/", async (req, res) => {
  const city = req.body.city;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;

    const temp = data.main.temp;
    const condition = data.weather[0].main;

    let tip = "";

    if (condition === "Rain") tip = "☔ Bring an umbrella and dance in the rain!";
    else if (condition === "Clear" && temp > 25) tip = "😎 It's hot! Grab water, shades, and wear something breezy.";
    else if (temp < 10) tip = "🧥 It's chilly! Layer up like a winter burrito.";
    else if (condition === "Snow") tip = "❄️ Wear boots, gloves, and maybe build a snowman.";
    else if (condition === "Clouds") tip = "☁️ Cloudy but no drama. Light jacket should be fine.";
    else tip = "🌀 Just be ready for anything. You're strong, you've got this!";

    const weather = `In ${city}, it's ${temp}°C with ${condition}.`;

    res.render("index.ejs", { weather, tip, error: null });
  } catch (error) {
    res.render("index.ejs", {
      weather: null,
      tip: null,
      error: "City not found. Please try again!",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
