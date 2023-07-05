import { Navigation } from '@/components/Navigation'
import React from 'react'

interface LayoutProps {
    children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Navigation />
            <main>{children}</main>
        </>
    )
}
