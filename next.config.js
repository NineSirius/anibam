/** @type {import('next').NextConfig} */
import nextPwa from 'next-pwa'

const withPWA = nextPwa({
    dest: 'public',
    register: true,
    skipWaiting: true,
})

const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['res.cloudinary.com', 'api.anilibria.tv', 'anilibria.tv'],
    },
}

export default nextConfig
