/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    REPO_URL: "https://github.com/wahidari",
    // API_URL: "http://localhost:3000",
  },
  // this cause some dropdown of react wyswyg editor not working in react 18
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com"],
  },
}

module.exports = nextConfig
