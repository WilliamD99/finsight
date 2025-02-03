

import CryptoJS from "crypto-js";



export function decryptToken(token: string) {
    const decrytedToken = CryptoJS.AES.decrypt(token, process.env.ENCRYPTION_KEY!).toString(CryptoJS.enc.Utf8)
    return decrytedToken
}