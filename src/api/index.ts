import axios from 'axios'

const strapiApi = axios.create({
    baseURL: 'http://localhost:1337/api',
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
    try {
        const response = await strapiApi.post('auth/local/register', data)
        return response.data
    } catch (error) {
        throw new Error(error.response.data)
    }
}

export interface LoginData {
    identifier: string
    password: string
}

export const loginUser = async (data: LoginData) => {
    try {
        const response = await strapiApi.post('auth/local', data)
        return response.data
    } catch (error) {
        throw new Error(error.response.data)
    }
}

export const getUserData = async (token: string) => {
    try {
        const response = await strapiApi.get('users/me?populate=*', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        throw new Error(error.response.data)
    }
}

export const getTitleByTitle = async (title: string) => {
    try {
        const response = await strapiApi.get(
            `title?populate=deep&filters[title_id]=${title}`,
        )
        return response.data
    } catch (error) {
        throw new Error(error.response.data)
    }
}
