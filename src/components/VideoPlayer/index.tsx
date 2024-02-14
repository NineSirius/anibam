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
import clsx from 'clsx'
import { Slider } from '../UI/Slider'
import { Loader } from '../UI/Loader'
import { TitleT, playerListT, skipsT } from '@/containers/types/TitleT'
import Image from 'next/image'
import { Button } from '../UI/Button'
import { useRouter, useSearchParams } from 'next/navigation'
import { SavedTitleCardProps } from '../SavedTitleCard'

type VideoPlayerProps = {
    activeEpisode: number
    playList: playerListT[]
    titleInfo: TitleT
    className?: string
}

export const formatPlayerTime = (seconds: number): string => {
    let minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    if (seconds > 3600) {
        const hours = Math.floor(seconds / 3600)
        minutes = Math.floor(seconds / 60) - hours * 60
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    } else {
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ activeEpisode, playList, titleInfo, className }) => {
    const playerRef = useRef<ReactPlayer | null>(null)
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [pause, setPause] = useState<boolean>(false)
    const [playing, setPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5)
    const [isMute, setIsMute] = useState<boolean>(false)
    const [seekTime, setSeekTime] = useState<number>(0)
    const [savedSeekTime, setSavedSeekTime] = useState<number>(0)
    const [bufferTime, setBufferTime] = useState<number>(0)
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
    const [playbackRate, setPlaybackRate] = useState(1.0)
    const [quality, setQuality] = useState<any[]>([])
    const [activeEpisodeQuality, setActiveEpisodeQuality] = useState<number>(0)
    const [played, setPlayed] = useState(0)
    const [duration, setDuration] = useState<number>(0)
    const [controlsShow, setControlsShow] = useState<boolean>(false)
    const [lastMouseMove, setLastMouseMove] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [savedData, setSavedData] = useState<SavedTitleCardProps[]>([])
    const [savedDataIndex, setSavedDataIndex] = useState<number | null>(null)
    const [savedSeek, setSavedSeek] = useState<number | null>(null)

    const [settingsShow, setSettingsShow] = useState<boolean>(false)

    const router = useRouter()
    const searchParams = useSearchParams()

    const handleMouseMove = useCallback(() => {
        setLastMouseMove(Date.now())

        if (!controlsShow) {
            setControlsShow(true)
        }
    }, [controlsShow])

    useEffect(() => {
        const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        if (mobile) {
            setIsMobile(true)
            setVolume(1)
        }
    }, [isMobile])

    useEffect(() => {
        const volume = localStorage.getItem('volume')
        const playbackRate = localStorage.getItem('playbackRate')
        const quality = localStorage.getItem('quality')
        const isMute = localStorage.getItem('isMute')

        if (volume) {
            setVolume(+volume)
        } else {
            setVolume(0.5)
            localStorage.setItem('volume', `${0.5}`)
        }

        if (isMute) {
            switch (isMute) {
                case 'true':
                    setIsMute(true)
                    break
                default:
                    setIsMute(false)
                    break
            }
        } else {
            setIsMute(false)
            localStorage.setItem('isMute', 'false')
        }

        if (playbackRate) {
            setVolume(+playbackRate)
        } else {
            setVolume(1)
            localStorage.setItem('playbackRate', `${1}`)
        }

        const savedWatchData = localStorage.getItem('savedWatchData')

        if (savedWatchData) {
            const parsedWatchData = JSON.parse(savedWatchData)
            const index = parsedWatchData.findIndex((item: any) => item.code === titleInfo.code)
            setSavedData(parsedWatchData)
            if (index >= 0) {
                setSavedDataIndex(index)
            }
        }

        const episodeIndex = playList.findIndex((title) => title.episode === activeEpisode)

        const qualityArray = Object.keys(playList[episodeIndex].hls).map((key) => ({
            quality: key,
            //@ts-ignore
            url: playList[episodeIndex].hls[key],
        }))
        setActiveEpisodeQuality(qualityArray.findIndex((qualityItem) => qualityItem.url))
        setQuality(qualityArray)
    }, [activeEpisode, playList, titleInfo.code])

    // useEffect(() => {
    //     if (playerRef.current && playerRef.current.getDuration()) {
    //         const duration = playerRef.current.getDuration()
    //         playerRef.current.seekTo(played * duration)
    //     }
    // }, [played])

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
            if (currentTime - lastMouseMove >= 3000) {
                setControlsShow(false)
            }
        }

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
        const handleKeyPress = (e: KeyboardEvent) => {
            const prevVolume = volume * 100
            switch (e.code) {
                case 'KeyF':
                    handleFullscreenToggle()
                    break
                case 'Space':
                    e.preventDefault()
                    handlePlayPause()
                    break
                case 'ArrowRight':
                    handleSeekForward()
                    break
                case 'ArrowLeft':
                    handleSeekBackward()
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    if (prevVolume <= 90) {
                        handleVolumeChange(prevVolume + 10)
                    }
                    break
                case 'ArrowDown':
                    e.preventDefault()
                    if (prevVolume >= 10) {
                        handleVolumeChange(prevVolume - 10)
                    }
                    break
                case 'KeyM':
                    setIsMute((prev) => !prev)
                    break
                case 'Escape':
                    if (isFullscreen) {
                        handleFullscreenToggle()
                    }
                    break
                default:
                    break
            }
        }

        document.addEventListener('keydown', handleKeyPress)
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duration, isFullscreen, volume])

    useEffect(() => {
        if (savedSeekTime) {
            setSavedSeekTime(0)
        }
        if (playing) {
            setPlaying(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [savedSeekTime])

    useEffect(() => {
        if (playerRef.current && playing && savedSeek) {
            playerRef.current.seekTo(savedSeek)
            setSavedSeek(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playing, seekTime])

    const onProgress = (state: any) => {
        setBufferTime(state.loadedSeconds)

        // setSeekTime(state.playedSeconds)

        if (seekTime >= 1 && savedSeek) {
            setSeekTime(savedSeek)
            setSavedSeek(null)
        } else {
            setSeekTime(state.playedSeconds)
        }

        if (titleInfo) {
            const savedWatchData = localStorage.getItem('savedWatchData')

            const saveData = {
                code: titleInfo.code,
                title: titleInfo.names.ru,
                playedInfo: {
                    e: playList[activeEpisode].episode,
                    t: state.playedSeconds,
                    epTime: duration,
                },
            }

            if (savedWatchData) {
                const parsedWatchData = JSON.parse(savedWatchData)
                if (parsedWatchData.find((item: TitleT) => item.code === titleInfo.code)) {
                    const index = parsedWatchData.findIndex((item: TitleT) => item.code === titleInfo.code)
                    parsedWatchData[index] = saveData
                    localStorage.setItem('savedWatchData', JSON.stringify(parsedWatchData))
                } else {
                    parsedWatchData.push(saveData)
                    localStorage.setItem('savedWatchData', JSON.stringify(parsedWatchData))
                }
            } else {
                localStorage.setItem('savedWatchData', '[]')
            }

            // localStorage.setItem(`title-${titleInfo.id}`, JSON.stringify(saveData))
        }
    }

    const handleVideoReady = () => {
        setLoading(false)
    }

    const handleVideoError = () => {
        setLoading(false)
        setError(true)
    }

    const handlePlayPause = () => {
        setPause((prevState) => !prevState)
    }

    const handleFullscreenToggle = useCallback(() => {
        setIsFullscreen((prevState) => !prevState)
        if (!isFullscreen) {
            const playerContainer = document.getElementById('video-player-container')
            if (playerContainer && playerContainer.requestFullscreen) {
                playerContainer.requestFullscreen()
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
        }
    }, [isFullscreen])

    const handleSeekBackward = () => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime()
            const newTime = currentTime - 10
            playerRef.current.seekTo(Math.max(newTime, 0))
        }
    }

    const handleSeekForward = () => {
        if (playerRef.current && duration) {
            const currentTime = playerRef.current.getCurrentTime()
            const newTime = currentTime + 10
            const maxTime = duration - 1
            playerRef.current.seekTo(Math.min(newTime, maxTime))
        }
    }

    const handleVolumeChange = (value: number) => {
        setIsMute(false)
        setVolume(value / 100)
        localStorage.setItem('isMute', 'false')
        localStorage.setItem('volume', `${value / 100}`)
    }

    const handleIsMuteChange = () => {
        localStorage.setItem('isMute', `${!isMute}`)
        setIsMute(!isMute)
    }

    const handleQualityChange = (newQuality: 'fhd' | 'hd' | 'sd') => {
        if (playerRef.current && playerRef.current.getCurrentTime()) {
            setPlayed(playerRef.current.getCurrentTime() / playerRef.current.getDuration())
        }
        const index = quality.findIndex((qualityItem) => qualityItem.quality === newQuality)
        setActiveEpisodeQuality(index)
    }

    const handleControlZoneClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.detail === 1) {
            if (isMobile && !controlsShow) {
                setControlsShow(true)
            } else {
                handlePlayPause()
            }
        } else if (event.detail === 2) {
            handlePlayPause()
            handleFullscreenToggle()
        }
    }

    const getQualityByString = (quality: string) => {
        switch (quality) {
            case 'qhd':
                return '1440p'
            case 'fhd':
                return '1080p'
            case 'hd':
                return '720p'
            case 'sd':
                return '480p'
            default:
                break
        }
    }

    const onContinue = () => {
        if (savedDataIndex !== null && savedDataIndex >= 0) {
            if (playList[activeEpisode].episode !== savedData[savedDataIndex].playedInfo.e) {
                router.push(`/anime/${titleInfo.code}/episodes/${savedData[savedDataIndex].playedInfo.e}`)
            } else {
                setPlaying(true)
                setPause(true)
                setSavedSeek(savedData[savedDataIndex].playedInfo.t)
            }
        }
    }

    if (playing) {
        return (
            <div
                className={clsx(styles.player, className && className)}
                style={{ cursor: controlsShow ? 'initial' : 'none' }}
                id="video-player-container"
                onMouseEnter={() => setControlsShow(true)}
                onMouseLeave={() => setControlsShow(false)}
            >
                <div className={styles.controls_zone} onClick={handleControlZoneClick}>
                    {loading ? (
                        <Loader />
                    ) : (
                        <>
                            <button className={clsx(styles.play_btn, !pause && styles.active)}>
                                <MdPlayArrow size={128} color="#fff" />
                            </button>
                            <button className={clsx(styles.play_btn, pause && styles.active)}>
                                <MdPause size={128} color="#fff" />
                            </button>
                        </>
                    )}
                </div>
                <ReactPlayer
                    ref={playerRef}
                    url={`https://cache.libria.fun${quality[activeEpisodeQuality].url}`}
                    playing={pause}
                    volume={isMute ? 0 : volume}
                    playbackRate={playbackRate}
                    controls={false}
                    onStart={() => {
                        if (savedSeek) {
                            setSeekTime(savedSeek)
                        }
                    }}
                    width="100%"
                    height="100%"
                    onReady={handleVideoReady}
                    onBuffer={() => setLoading(true)}
                    onBufferEnd={() => setLoading(false)}
                    onError={handleVideoError}
                    onProgress={onProgress}
                    playIcon={<MdPlayArrow size={32} />}
                    bufferTime={40000}
                    onDuration={(duration) => {
                        setDuration(duration)
                    }}
                    // {...(quality !== 'auto' && { config: { file: { attributes: { quality } } } })}
                />

                <button
                    onClick={() => {
                        setSeekTime(playList[activeEpisode].skips?.opening[1] / duration)
                        if (playerRef.current && playerRef.current.getDuration()) {
                            const duration = playerRef.current.getDuration()
                            playerRef.current.seekTo(playList[activeEpisode].skips?.opening[1] / duration)
                        }
                    }}
                    className={clsx(
                        styles.skip_opening,
                        playList[activeEpisode].skips?.opening.length > 0 &&
                            seekTime >= playList[activeEpisode].skips?.opening[0] &&
                            seekTime < playList[activeEpisode].skips?.opening[0] + 15 &&
                            styles.active,
                    )}
                >
                    Пропустить заставку
                </button>
                <div className={clsx(styles.controls, controlsShow && styles.active)}>
                    <Slider
                        id="seekSlider"
                        max={Math.floor(duration)}
                        min={0}
                        value={Math.floor(seekTime)}
                        onChange={(value) => setSeekTime(value)}
                        onAfterChange={(value) => {
                            if (playerRef.current && playerRef.current.getDuration()) {
                                const duration = playerRef.current.getDuration()
                                // @ts-ignore
                                playerRef.current.seekTo(value)
                            }
                        }}
                        isTooltip
                        formatTime={formatPlayerTime}
                        loaded={bufferTime}
                    />
                    <div className={clsx(styles.settings, settingsShow && styles.show)}>
                        {quality
                            .filter((quality) => quality.url)
                            .map((item, index) => {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setSavedSeekTime(seekTime)
                                            setActiveEpisodeQuality(index)
                                            handleQualityChange(item.quality)
                                        }}
                                    >
                                        {getQualityByString(item.quality)}
                                    </button>
                                )
                            })}
                    </div>
                    <div className={styles.controls_footer}>
                        <div className={styles.controls_footer_left}>
                            <button onClick={handlePlayPause}>
                                {pause ? <MdPause size={32} /> : <MdPlayArrow size={32} />}
                            </button>
                            <div className={styles.volume}>
                                {!isMobile && (
                                    <button onClick={handleIsMuteChange}>
                                        {isMute ? (
                                            <MdVolumeOff size={28} />
                                        ) : volume > 0.2 ? (
                                            <MdVolumeUp size={28} />
                                        ) : volume > 0 ? (
                                            <MdVolumeDown size={28} />
                                        ) : (
                                            <MdVolumeOff size={28} />
                                        )}
                                    </button>
                                )}
                                <Slider
                                    id="volumePicker"
                                    min={0}
                                    max={100}
                                    value={isMute ? 0 : volume * 100}
                                    onChange={handleVolumeChange}
                                    className={styles.volume_picker}
                                />
                            </div>

                            {duration && (
                                <div className={styles.time}>
                                    <span>{formatPlayerTime(seekTime)}</span> /{' '}
                                    <span>{formatPlayerTime(duration)}</span>
                                </div>
                            )}
                        </div>
                        <div className={styles.controls_footer_right}>
                            <button onClick={() => setSettingsShow(!settingsShow)}>
                                {getQualityByString(quality[activeEpisodeQuality].quality)}
                            </button>
                            <button onClick={handleFullscreenToggle}>
                                {isFullscreen ? <MdFullscreenExit size={32} /> : <MdFullscreen size={32} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className={styles.player_container}>
                <Image
                    src={
                        playList[activeEpisode] && playList[activeEpisode].preview
                            ? `https://anilibria.tv${playList[activeEpisode].preview}`
                            : '/img/base-preview.png'
                    }
                    width={1280}
                    height={720}
                    alt={'Смотрите аниме на AniBam'}
                    className={styles.preview}
                />
                <button
                    className={styles.play_btn}
                    onClick={() => {
                        setPlaying(true)
                        setPause(true)
                    }}
                >
                    <MdPlayArrow color="#fff" size={128} />
                </button>

                {savedData && savedDataIndex !== null && savedDataIndex >= 0 && (
                    <div className={styles.continue}>
                        {/* <p>
                            Вы остановились на {savedData[savedDataIndex].playedInfo.e} серии -{' '}
                            {formatPlayerTime(savedData[savedDataIndex].playedInfo.t)}
                        </p> */}
                        <button className={styles.continue_btn} onClick={onContinue}>
                            Продолжить просмотр
                        </button>
                    </div>
                )}
            </div>
        )
    }
}

export default VideoPlayer
