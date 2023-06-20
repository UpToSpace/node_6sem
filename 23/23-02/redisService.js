const {ConnectToRedis}=require('./connectRedis')

 const AddTokenToBlackList = async (token) => {
    const client =  await ConnectToRedis();
    await client.set(token,  '1', 'EX', 60 * 60 * 24);
};
 const tokenInBlackList = async (token) => {
    const client =  await ConnectToRedis();
    const result = await client.get(token);
    return result === '1';
};

module.exports={ AddTokenToBlackList,tokenInBlackList}