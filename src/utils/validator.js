import {compare, hash} from 'bcrypt'
export const encrypt = (password)=>{
    try {
        return hash(password, 10)
    } catch (error) {
        console.log(error)
        return error
    }
}

export const checkPassword = async (password, hash)=>{
    try {
        return await compare(password, hash)
    } catch (error) {
        console.log(error)
        return error
    }
}

export const validateParamsEmpty = (data) => {
    for (let key in data) {
        // Verifica si el valor es null, undefined o una cadena vacía
        if (data[key] === null || data[key] === undefined || data[key] === '') {
            return false // Devuelve falso si se encuentra un dato vacío
        }
    }
    return true
}