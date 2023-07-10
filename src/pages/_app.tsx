import { Layout } from '@/containers/Layout'
import { store } from '@/store'
import '@/styles/globals.sass'
import type { AppProps } from 'next/app'
import { Ubuntu } from 'next/font/google'
import { SnackbarProvider } from 'notistack'
import { Provider } from 'react-redux'

const ubuntu = Ubuntu({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <div className={ubuntu.className}>
                <SnackbarProvider maxSnack={3}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </SnackbarProvider>
            </div>
        </Provider>
    )
}
