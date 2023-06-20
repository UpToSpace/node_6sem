const crypto = require('crypto');
class ServerDH {
    constructor(len_a, g) {
        const dh = crypto.createDiffieHellman(len_a, g);
        const p = dh.getPrime();
        const gb = dh.getGenerator();
        const k = dh.generateKeys(); // публичный ключ сервера
        this.getContext = () => { // Метод getContext возвращает контекст сервера Diffie-Hellman
            return {
                p_hex: p.toString('hex'),
                g_hex: gb.toString('hex'),
                key_hex: k.toString('hex')
            };
        };
        this.getSecret = (clientContext) => {// Метод getSecret вычисляет общий секретный ключ на основе ключа клиента
            const k = Buffer.from(clientContext.key_hex, 'hex');
            return dh.computeSecret(k);
        };
    }
}
class ClientDH {
    constructor(serverContext) { 
        const ctx = {
            p_hex: serverContext.p_hex,
            g_hex: serverContext.g_hex,
        };
        const p = Buffer.from(ctx.p_hex, 'hex');
        const g = Buffer.from(ctx.g_hex, 'hex');
        const dh = crypto.createDiffieHellman(p, g);
        const k = dh.generateKeys(); // публичный ключ клиента
        this.getContext = () => {
            return {
                p_hex: p.toString('hex'),
                g_hex: g.toString('hex'),
                key_hex: k.toString('hex')
            };
        };
        this.getSecret = (serverContext) => { // Метод getSecret вычисляет общий секретный ключ на основе ключа сервера
            const k = Buffer.from(serverContext.key_hex, 'hex');
            return dh.computeSecret(k);
        };
    }
}
module.exports.ServerDH = ServerDH;
module.exports.ClientDH = ClientDH;