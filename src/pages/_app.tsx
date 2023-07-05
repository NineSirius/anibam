import { Layout } from '@/containers/Layout'
import '@/styles/globals.sass'
import type { AppProps } from 'next/app'
import { Ubuntu } from 'next/font/google'

const ubuntu = Ubuntu({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className={ubuntu.className}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </div>
    )
}
