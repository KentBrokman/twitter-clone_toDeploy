import crypto from 'crypto'

export const generateMD5 = (value: string): string => {
    return crypto.createHash('md5').update(value).digest('hex')
}

// crypto.createHash('md5') - создает объект для хэшировния в указанном формате 
// update(value) хаширует по заданному ключу
// digest('hex') выдает результат хэширования в 16ой системе 