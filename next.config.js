/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['res.cloudinary.com', 'api.anilibria.tv', 'anilibria.tv'],
    },
}

module.exports = nextConfig
