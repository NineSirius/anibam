import Layout from '@/containers/Layout'
import { store } from '@/store'
import '@/styles/globals.sass'
import '@/styles/root.sass'
import '@/styles/dark.sass'
import type { AppProps } from 'next/app'
import { Open_Sans } from 'next/font/google'
import { SnackbarProvider } from 'notistack'
import { Provider } from 'react-redux'
import Cookie from 'js-cookie'

const openSans = Open_Sans({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <div className={openSans.className}>
                <SnackbarProvider maxSnack={3}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </SnackbarProvider>
            </div>
        </Provider>
    )
}
