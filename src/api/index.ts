import axios from 'axios'

const strapiApi = axios.create({
    baseURL: 'https://anibam-api.onrender.com/api/',
})

export const getTitles = async () => {
    try {
        const response = await strapiApi.get('get-titles?populate=deep')
        return response
    } catch (error) {
        // throw new Error(error)
        return null
    }
}

export interface RegisterData {
    email: string
    username: string
    password: string
}

export const registerUser = async (data: RegisterData): Promise<any> => {
    const response = await strapiApi.post('auth/local/register', data)
    return response.data
}

export interface LoginData {
    identifier: string
    password: string
}

export const loginUser = async (data: LoginData) => {
    const response = await strapiApi.post('auth/local', data)
    return response.data
}

export const getUserData = async (token: string) => {
    const response = await strapiApi.get('users/me?populate=*', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return response.data
}

export const getTitleByTitle = async (title: any) => {
    const response = await strapiApi.get(`get-titles?populate=deep&filters[title_id]=${title}`)
    return response.data
}

export const getTitleByName = async (name: string) => {
    const response = await strapiApi.get(`get-titles?populate=deep&filters[title]=${name}`)
    return response.data
}
