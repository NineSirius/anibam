'use client'

import { store } from '@/store'
import { Metadata } from 'next'
import { Provider } from 'react-redux'
import { Rubik } from 'next/font/google'
import { SnackbarProvider } from 'notistack'
import Layout from '@/containers/Layout'

import '@/styles/globals.sass'
import '@/styles/root.sass'

// export const metadata: Metadata = {
//     title: 'AniBam - лучший сайт для просмотра аниме',
//     description: 'Welcome to Next.js',
// }

const openSans = Rubik({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru">
            <body>
                <Provider store={store}>
                    <div className={openSans.className}>
                        <SnackbarProvider maxSnack={3}>
                            <Layout>{children}</Layout>
                        </SnackbarProvider>
                    </div>
                </Provider>
            </body>
        </html>
    )
}
