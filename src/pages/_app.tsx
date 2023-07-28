import Layout from '@/containers/Layout'
import { store } from '@/store'
import '@/styles/globals.sass'
import '@/styles/root.sass'
import '@/styles/dark.sass'
import '@/styles/videoSeekSliderStyles.css'
import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import { SnackbarProvider } from 'notistack'
import { Provider } from 'react-redux'

const openSans = Roboto({
    weight: ['400', '500', '700'],
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
