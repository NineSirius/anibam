import React, { useState, useEffect, ChangeEvent } from 'react'
import styles from './ProfilePage.module.sass'
import { UserTypes } from '@/store/reducers/user.reducer'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ReactCrop, { Crop, PercentCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Modal } from '@/components/UI/Modal'
import { Button } from '@/components/UI/Button'

interface Profile {
    data: UserTypes | 'None'
}

const ProfilePage: React.FC<Profile> = ({ data }) => {
    const [userInfo, setUserInfo] = useState<UserTypes | null>(null)
    const [src, setSrc] = useState<any | null>(null)
    const [image, setImage] = useState<HTMLImageElement | null>(null)
    const [crop, setCrop] = useState<any>({ aspect: 1 / 1 })
    const [output, setOutput] = useState<any | null>(null)
    const [modalShow, setModalShow] = useState<boolean>(false)
    const [imageWidth, setImageWidth] = useState<number | null>(null)
    const [imageHeight, setImageHeight] = useState<number | null>(null)

    const router = useRouter()

    useEffect(() => {
        if (data && data !== 'None') {
            setUserInfo(data)
        } else {
            router.push('/auth/login')
        }
    }, [data, router])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader()
            reader.onload = () => {
                setSrc(reader.result as string)

                const img = new (window as any).Image()
                img.src = reader.result as string
                img.onload = () => {
                    setImage(img)
                    setImageWidth(250)
                    setImageHeight(250)
                    setCrop((prevCrop: Crop) => ({
                        ...prevCrop,
                        width: 250,
                        height: 250,
                        aspect: img.width / img.height,
                    }))
                }

                setModalShow(true)
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }

    const handleCropComplete = (crop: Crop, pixelCrop: PercentCrop) => {
        if (image) {
            const croppedImageUrl = getCroppedImageUrl(image, pixelCrop)
            setOutput(croppedImageUrl)
        }
    }

    const getCroppedImageUrl = (image: HTMLImageElement, crop: PercentCrop): any => {
        const canvas = document.createElement('canvas')
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        canvas.width = crop.width! * scaleX
        canvas.height = crop.height! * scaleY
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(
            image,
            crop.x! * scaleX,
            crop.y! * scaleY,
            crop.width! * scaleX,
            crop.height! * scaleY,
            0,
            0,
            crop.width! * scaleX,
            crop.height! * scaleY,
        )
        return {
            url: canvas.toDataURL('image/jpeg'),
            width: crop.width * scaleX,
            height: crop.height * scaleY,
        }
    }
    return (
        <>
            <Head>
                <title>Профиль пользователя {userInfo?.username}</title>
            </Head>
            <div className={styles.profile}>
                <div className={styles.banner} style={{ backgroundColor: '#333' }}>
                    <div className="container">
                        <label>
                            {userInfo?.avatar ? (
                                <Image
                                    src={userInfo.avatar.url}
                                    width={100}
                                    height={100}
                                    alt={`Аватарка пользователя ${userInfo.username}`}
                                />
                            ) : (
                                <div className={styles.base_avatar}>
                                    {userInfo?.username[0].toUpperCase()}
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/jpeg, image/png, image/gif"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                </div>
            </div>

            <Modal show={modalShow} onClose={() => setModalShow(false)}>
                <ReactCrop
                    crop={crop}
                    aspect={1 / 1}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c, pixelCrop) => handleCropComplete(c, pixelCrop)}
                >
                    {src && imageWidth && imageHeight && (
                        <Image
                            src={src}
                            width={imageWidth}
                            height={imageHeight}
                            alt="dsdsds"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    )}
                </ReactCrop>
                <div>
                    <Button>Сохранить</Button>
                </div>

                {output && (
                    <div>
                        <Image
                            src={output.url}
                            alt="Cropped Image"
                            width={output.width}
                            height={output.height}
                        />
                    </div>
                )}
            </Modal>
        </>
    )
}

export default ProfilePage
