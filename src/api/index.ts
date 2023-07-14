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
    const response = await strapiApi.get('users/me?populate=deep', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return response.data
}

export const getUserLists = async (userId: number) => {
    const response = await strapiApi.get(
        `users/${userId}?populate=deep&fields[0]=watch_list&fields[1]=viewed_list&fields[2]=planned_list`,
    )
    return response.data
}

export const getTitleByTitle = async (title: any) => {
    const response = await strapiApi.get(`get-titles?populate=deep&filters[title_id]=${title}`)
    return response.data
}

export const getTitleByName = async (name: string) => {
    const query = name.charAt(0).toUpperCase() + name.slice(1)
    const response = await strapiApi.get(
        `get-titles?filters[title][$contains]=${query}&fields[0]=title&fields[1]=status&fields[2]=poster&populate=poster&fields[3]=title_id`,
    )
    return response.data
}

export const getTitleWithCustomFields = async (query: any[]) => {
    const response = await strapiApi.get(
        `get-titles?populate=*${query.map((item, index) => `&fields[${index}]=${item}`).join('')}`,
    )
    return response.data
}

export const getTitleRating = async (titleId: string) => {
    const response = await strapiApi.get(
        `http://localhost:1337/api/get-titles?filters[title_id]=${titleId}&populate=rating&fields[0]=rating`,
    )
    return response
}

export const addToUserFolder = async (
    folder: string,
    animeId: number,
    userId: number,
    token: string,
) => {
    const response = await strapiApi.put(
        `users/${userId}`,
        {
            [folder]: {
                connect: [{ id: animeId, position: { end: true } }],
            },
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    )
    return response
}

export const removeFromUserFolder = async (
    folder: string,
    animeId: number,
    userId: number,
    token: string,
) => {
    const response = await strapiApi.put(
        `users/${userId}`,
        {
            [folder]: {
                disconnect: [{ id: animeId }],
            },
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    )
    return response
}
