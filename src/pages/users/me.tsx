import cookie from 'cookie'
import { getUserData } from '@/api'
import ProfilePage from '@/containers/ProfilePage'
import Cookie from 'js-cookie'
import React from 'react'

const Profile: React.FC<{ data: any }> = ({ data }) => {
    return <ProfilePage data={data} />
}

export default Profile

export const getServerSideProps = async (context: any) => {
    const parsedCookies = context.req.headers.cookie
        ? cookie.parse(context.req.headers.cookie)
        : null
    console.log(context)

    if (parsedCookies) {
        const res = await getUserData(parsedCookies.auth_token)
        const data = res

        return {
            props: {
                data,
            },
        }
    } else {
        return {
            props: {
                data: 'None',
            },
        }
    }
}
