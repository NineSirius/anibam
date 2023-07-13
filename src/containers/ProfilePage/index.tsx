import React, { useState, useEffect, ChangeEvent } from 'react'
import styles from './ProfilePage.module.sass'
import { UserTypes } from '@/store/reducers/user.reducer'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Modal } from '@/components/UI/Modal'

interface Profile {
    data: UserTypes | 'None'
}

const ProfilePage: React.FC<Profile> = ({ data }) => {
    const [userInfo, setUserInfo] = useState<UserTypes | null>(null)
    const [src, setSrc] = useState<string | null>(null)
    const [image, setImage] = useState<HTMLImageElement | null>(null)
    const [crop, setCrop] = useState<any>({ aspect: 16 / 9 })
    const [output, setOutput] = useState<string | null>(null)
    const [modalShow, setModalShow] = useState<boolean>(false)

    const router = useRouter()

    const cropImageNow = () => {
        if (image && crop.width && crop.height) {
            const canvas = document.createElement('canvas')
            const scaleX = image.width / crop.width
            const scaleY = image.height / crop.height
            canvas.width = crop.width
            canvas.height = crop.height
            const ctx = canvas.getContext('2d')

            const pixelRatio = window.devicePixelRatio
            canvas.width = crop.width * pixelRatio
            canvas.height = crop.height * pixelRatio
            ctx!.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
            ctx!.imageSmoothingQuality = 'high'

            ctx!.drawImage(
                image,
                crop.x! * scaleX,
                crop.y! * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width,
                crop.height,
            )

            // Converting to base64
            const base64Image = canvas.toDataURL('image/jpeg')
            setOutput(base64Image)
        }
    }

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
                setModalShow(true)
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }

    const handleCropChange = (newCrop: Crop) => {
        setCrop(newCrop)
    }

    const handleCropComplete = (crop: Crop, pixelCrop: Crop) => {
        if (image) {
            const croppedImageUrl = getCroppedImageUrl(image, pixelCrop)
            setSrc(croppedImageUrl)
        }
    }

    const getCroppedImageUrl = (image: HTMLImageElement, crop: Crop) => {
        const canvas = document.createElement('canvas')
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        canvas.width = crop.width!
        canvas.height = crop.height!
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(
            image,
            crop.x! * scaleX,
            crop.y! * scaleY,
            crop.width! * scaleX,
            crop.height! * scaleY,
            0,
            0,
            crop.width!,
            crop.height!,
        )
        return canvas.toDataURL('image/jpeg')
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
                <h4>Картинка</h4>
            </Modal>
        </>
    )
}

export default ProfilePage
