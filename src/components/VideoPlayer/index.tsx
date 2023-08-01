import React, { useState, useRef, useEffect, useCallback } from 'react'
import ReactPlayer from 'react-player'
import {
    MdPlayArrow,
    MdPause,
    MdVolumeUp,
    MdFullscreen,
    MdFullscreenExit,
    MdVolumeDown,
    MdVolumeOff,
} from 'react-icons/md'
import styles from './VideoPlayer.module.sass'
import { Select } from '../UI/Select'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css' // Подключаем стили rc-slider
import { VideoPlayerProps } from './types'
import clsx from 'clsx'

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, qualityOptions, skips }) => {
    const playerRef = useRef<ReactPlayer | null>(null)
    const [playing, setPlaying] = useState(false)
    const [volume, setVolume] = useState(0.2)
    const [seekTime, setSeekTime] = useState<number>(0)
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
    const [playbackRate, setPlaybackRate] = useState(1.0)
    const [quality, setQuality] = useState<string | undefined>(
        qualityOptions ? qualityOptions[0].quality : undefined,
    )
    const [activeUrl, setActiveUrl] = useState<string | undefined>(
        qualityOptions ? qualityOptions[0].url : url,
    )
    const [played, setPlayed] = useState(0)
    const [duration, setDuration] = useState<number>(0)
    const [controlsShow, setControlsShow] = useState<boolean>(false)
    const [lastMouseMove, setLastMouseMove] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    const handleMouseMove = useCallback(() => {
        setLastMouseMove(Date.now())

        if (!controlsShow) {
            setControlsShow(true)
        }
    }, [controlsShow])

    useEffect(() => {
        if (playerRef.current && playerRef.current.getDuration()) {
            const duration = playerRef.current.getDuration()
            playerRef.current.seekTo(played * duration)
        }
    }, [played])

    useEffect(() => {
        if (qualityOptions) {
            setActiveUrl(qualityOptions[0].url)
        } else {
            setActiveUrl(url)
        }
    }, [qualityOptions, url])

    useEffect(() => {
        const playerContainer = document.getElementById('video-player-container')
        if (playerContainer) {
            playerContainer.addEventListener('mousemove', handleMouseMove)

            return () => {
                playerContainer.removeEventListener('mousemove', handleMouseMove)
            }
        }
    }, [handleMouseMove])

    useEffect(() => {
        const checkCursorMovement = () => {
            const currentTime = Date.now()
            // Check if the cursor hasn't moved for 3 seconds
            if (currentTime - lastMouseMove >= 3000) {
                // Hide controls
                setControlsShow(false)
            }
        }

        // Set an interval to check cursor movement every 1 second
        const interval = setInterval(checkCursorMovement, 3000)

        return () => {
            clearInterval(interval)
        }
    }, [lastMouseMove])

    useEffect(() => {
        if (playerRef.current) {
            const duration = playerRef.current.getDuration()
            if (duration) {
                setDuration(duration)
            }
        }
    }, [])

    useEffect(() => {
        const checkCursorMovement = () => {
            const currentTime = Date.now()
            // Check if the cursor hasn't moved for 3 seconds
            if (currentTime - lastMouseMove >= 3000) {
                // Hide controls
                setControlsShow(false)
            }
        }

        // Set an interval to check cursor movement every 1 second
        const interval = setInterval(checkCursorMovement, 1000)

        return () => {
            // Clear the interval on unmount
            clearInterval(interval)
        }
    }, [lastMouseMove])

    const handleFullscreenToggle = useCallback(() => {
        setIsFullscreen((prevState) => !prevState)
        if (!isFullscreen) {
            // Запускаем вход в полноэкранный режим
            const playerContainer = document.getElementById('video-player-container')
            if (playerContainer && playerContainer.requestFullscreen) {
                playerContainer.requestFullscreen()
            }
        } else {
            // Запускаем выход из полноэкранного режима
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
        }
    }, [isFullscreen])

    useEffect(() => {
        const handleSeekForward = () => {
            if (playerRef.current && duration) {
                const currentTime = playerRef.current.getCurrentTime()
                const newTime = currentTime + 10
                const maxTime = duration - 1
                playerRef.current.seekTo(Math.min(newTime, maxTime))
            }
        }
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === ' ') {
                // Spacebar - Play/Pause
                handlePlayPause()
            } else if (e.key === 'ArrowRight') {
                // Right Arrow - Seek forward 10 seconds
                handleSeekForward()
            } else if (e.key === 'ArrowLeft') {
                // Left Arrow - Seek backward 10 seconds
                handleSeekBackward()
            } else if (e.key === 'f' || e.key === 'F') {
                // F key - Toggle fullscreen
                handleFullscreenToggle()
            }
        }

        document.addEventListener('keydown', handleKeyPress)
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [duration, handleFullscreenToggle])

    const handleVideoReady = () => {
        setLoading(false)
    }

    // Handle video error event
    const handleVideoError = () => {
        setLoading(false)
        setError(true)
    }

    const handlePlayPause = () => {
        setPlaying((prevState) => !prevState)
    }

    const handleSeekBackward = () => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime()
            const newTime = currentTime - 10
            playerRef.current.seekTo(Math.max(newTime, 0))
        }
    }

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value))
    }

    // const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setSeekTime(parseFloat(e.target.value))
    // }

    const handlePlaybackRateChange = (newPlaybackRate: number) => {
        setPlaybackRate(newPlaybackRate)
    }

    const handleQualityChange = (newQuality: string) => {
        if (playerRef.current && playerRef.current.getCurrentTime()) {
            // Save the current played time before changing the quality
            setPlayed(playerRef.current.getCurrentTime() / playerRef.current.getDuration())
        }
        setQuality(newQuality)
    }

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = Math.floor(seconds % 60)
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
            .toString()
            .padStart(2, '0')}`
    }

    return (
        <div
            className={styles.player}
            id="video-player-container"
            onMouseEnter={() => setControlsShow(true)}
            onMouseLeave={() => setControlsShow(false)}
        >
            <div className={styles.controls_zone} onClick={handlePlayPause}></div>
            <ReactPlayer
                ref={playerRef}
                url={activeUrl}
                playing={playing}
                volume={volume}
                playbackRate={playbackRate}
                controls={false}
                width="100%"
                height="100%"
                onReady={handleVideoReady}
                onError={handleVideoError}
                onProgress={(state) => {
                    setSeekTime(state.played)
                }}
                onDuration={(duration) => {
                    setDuration(duration)
                }}
                {...(quality !== 'auto' && { config: { file: { attributes: { quality } } } })}
            />

            {skips?.opening.length > 0 &&
                seekTime * duration >= skips?.opening[0] &&
                seekTime * duration < skips?.opening[0] + 10 && (
                    <button
                        onClick={() => {
                            setSeekTime(skips?.opening[1] / duration)
                            if (playerRef.current && playerRef.current.getDuration()) {
                                const duration = playerRef.current.getDuration()
                                playerRef.current.seekTo(skips?.opening[1] / duration)
                            }
                        }}
                        className={styles.skip_opening}
                    >
                        Пропустить заставку
                    </button>
                )}
            <div className={clsx(styles.controls, controlsShow && !loading && styles.active)}>
                <Slider
                    className={styles.seek_slider} // Применяем свои стили к ползунку
                    value={seekTime}
                    min={0}
                    max={1}
                    step={0.0001}
                    // @ts-ignore
                    onChange={(value) => setSeekTime(value)}
                    onAfterChange={(value) => {
                        if (playerRef.current && playerRef.current.getDuration()) {
                            const duration = playerRef.current.getDuration()
                            // @ts-ignore
                            playerRef.current.seekTo(value * duration)
                        }
                    }}
                />
                <div className={styles.controls_footer}>
                    <div className={styles.controls_footer_left}>
                        <button onClick={handlePlayPause}>
                            {playing ? <MdPause size={32} /> : <MdPlayArrow size={32} />}
                        </button>
                        <div className={styles.volume}>
                            <button>
                                {volume > 0.2 ? (
                                    <MdVolumeUp size={32} />
                                ) : volume > 0 ? (
                                    <MdVolumeDown size={32} />
                                ) : (
                                    <MdVolumeOff size={32} />
                                )}
                            </button>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step="any"
                                value={volume}
                                onChange={handleVolumeChange}
                                aria-label="Volume"
                                className={styles.volume_picker}
                            />
                        </div>

                        {duration && ( // 2. Отображаем текущее время и полное время видео, если продолжительность известна
                            <div className={styles.time}>
                                <span>{formatTime(seekTime * duration)}</span> /{' '}
                                <span>{formatTime(duration)}</span>
                            </div>
                        )}
                    </div>
                    <div className={styles.controls_footer_right}>
                        {qualityOptions && (
                            <Select
                                position="top"
                                className={styles.quality_select}
                                optionsClassName={styles.quality_options}
                                options={qualityOptions.map((item) => {
                                    switch (item.quality) {
                                        case 'fhd':
                                            return '1080p'
                                            break
                                        case 'hd':
                                            return '720p'
                                            break
                                        case 'sd':
                                            return '480p'
                                            break
                                        default:
                                            return 'none'
                                            break
                                    }
                                })}
                                value={
                                    quality === 'fhd'
                                        ? '1080p'
                                        : quality === 'hd'
                                        ? '720p'
                                        : quality === 'sd'
                                        ? '480p'
                                        : 'none'
                                }
                                onChange={(value) => {
                                    const qualityValue =
                                        value === '1080p'
                                            ? 'fhd'
                                            : value === '720p'
                                            ? 'hd'
                                            : value === '480p'
                                            ? 'sd'
                                            : 'none'

                                    setActiveUrl(() => {
                                        const qualityUrl = qualityOptions.filter(
                                            (option) => option.quality === qualityValue,
                                        )
                                        return qualityUrl[0].url
                                    })
                                    setQuality(qualityValue)
                                }}
                            />
                        )}
                        <button onClick={handleFullscreenToggle}>
                            {isFullscreen ? (
                                <MdFullscreenExit size={32} />
                            ) : (
                                <MdFullscreen size={32} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer
