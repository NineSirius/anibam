import { skipsT } from '@/containers/types/TitleT'

// types.d.ts
declare module 'react-player' {
    interface ReactPlayerProps {
        // Add any specific props from the 'react-player' library if needed
    }
}

export interface VideoPlayerProps {
    url: string
    qualityOptions?: any[]
    skips: skipsT
}

// Export the TypeScript declaration for the VideoPlayer component
export default function VideoPlayer(props: VideoPlayerProps): JSX.Element
