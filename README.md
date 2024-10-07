# 🌍 Satsync: Landsat Data at Your Fingertips

### Empowering Users to Effortlessly Track Landsat Surface Reflectance Changes

**Welcome to Satsync!** We are revolutionizing the accessibility of Landsat data to empower everyone—from researchers to environmental enthusiasts—to explore the Earth's surface changes with ease. Landsat has provided the longest continuous dataset of remotely sensed Earth observations, but accessing and using this treasure trove of information has been complex and cumbersome. **Satsync** is here to change that, creating an **ultra user-friendly, interactive web platform** that makes Landsat data as simple as adding a pin to a map.

---

## 🛰️ The Problem We're Solving

Landsat data is a valuable resource for understanding our planet, but accessing it can be quite inconvenient, often requiring specialized knowledge and labor-intensive effort. In its current state, Landsat Surface Reflectance (SR) data demands familiarity with multiple platforms, tedious data extraction processes, and manual searching for satellite overpasses.

Our challenge: **Make Landsat data accessible, subscribable, and visually approachable**. We want individuals to be able to receive data updates for locations they care about, automatically and without friction. Imagine **clicking on your favorite place on the globe and getting notified** whenever there's fresh Landsat data—and that's exactly what Satsync does.

---

## 💡 What is Satsync?

**Satsync** is a full-stack solution that simplifies Landsat data subscriptions into three steps:

1. **Pin Locations**: Users can zoom into any spot on a world map, then drop a pin on a location of interest.
2. **Subscribe to Notifications**: Once pinned, Satsync monitors when Landsat will fly over that specific location, allowing users to subscribe to email notifications when fresh imagery is available.
3. **Access Updated Data**: When there's an update, Satsync emails the user the most recent **Surface Reflectance data**, with easy-to-use tools to explore the pixel data, cloud cover, and even visualize the spectral signature.

**Key Features:**

- 🌍 **Interactive World Map**: Users can define their areas of interest by directly adding "pins" on an interactive map built with **Leaflet**.
- 📅 **Live Data Alerts**: Notifications when new Landsat data is available at one of your pinned locations, driven by our Landsat **cronjob data polling system**.

---

## 💻 Our Tech Stack & Architecture

The Satsync platform comprises an integrated architecture designed for reliability and responsiveness:

### Frontend
- **Next.js** framework combined with **Leaflet** for interactive map visuals.
- Enables users to easily locate points of interest and manage subscriptions visually.

### Backend
- **FastAPI** forms the backbone of our API layer, delivering dynamic data access and subscriptions to user requests.
- Scheduled cronjob scripts poll the **Landsat AWS S3 buckets** for updated scenes and ingest these into our system.
- **Postgres** database tracks user subscriptions, managing location pins, user details, and subscriptions seamlessly.

### Email Notifications
- We use **Mailgun** for managing email notifications, ensuring that users are notified promptly when new satellite data is available.

### Tileserver
- **Maptiler/tileserver-gl** is used to self-host our custom maps, ensuring that Landsat grid regions are overlaid accurately for context.

---

## 🌟 Why Satsync is Special

- **User-Centric**: No technical background? No problem. With a simple pin-drop mechanism, Satsync makes data tracking approachable for anyone.
- **Custom Notifications**: Users control the timing, lead-time, and notification preferences—personalizing data delivery like never before.
- **Spatial Thinking Encouraged**: Integrates spatial data into everyday exploration. Users see the data, see the scenes, and understand the satellite paths.
- **Hands-Free Access**: Once subscribed, users can step back and let the data come to them, without having to constantly search or download it manually.

---

## 🚀 How to Use Satsync

1. **Visit Our Web Interface**: Open **satsync.org** and start exploring Earth.
2. **Pin Your Points of Interest**: Drop pins on locations you'd like to monitor.
3. **Set Notifications**: Decide how far in advance you'd like to be alerted.
4. **Receive Updates**: Get emails when new data for your pin locations is ready.

We aim to foster **scientific exploration, interdisciplinary analysis, and encourage spatial awareness**. Satsync brings the data down to Earth—right to your inbox.

---

## 🏆 Hackathon Challenge Link

This project was developed during the [NASA Space Apps Challenge 2024](https://www.spaceappschallenge.org/nasa-space-apps-2024/challenges/landsat-reflectance-data-on-the-fly-and-at-your-fingertips/). Embracing the spirit of open-source development, Satsync is committed to being transparent, collaborative, and accessible for all. We believe that Satsync stands out by making Landsat's incredible data accessible, interactive, and personalized.

---

## 🤝 Join Us or Contribute!

Satsync is open-source! We are Michael and Conor, both students at the **University of Western Australia** in Perth. Michael studied **mathematics and statistics**, while Conor studied **physics**. We are proud to release this project under the **MIT License**, making it free and accessible for everyone to use, modify, and distribute. If you're excited about accessible earth science data or you're into GIS, remote sensing, and open data initiatives, consider contributing.

Check out our [GitHub Repository](https://github.com/yourproject/satsync) for more information, installation instructions, and to collaborate with us on the future of accessible remote sensing!

---

🌌 **Track the Earth's Changing Surface with Satsync: Your Personal Landsat Subscription Platform** 🌌

---

If you have any questions, ideas, or want to collaborate, feel free to open an issue or reach out! Let's make Earth observation as common and easy as checking the weather.
