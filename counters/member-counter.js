module.exports = async (zyntx) => {
    const guild = zyntx.guilds.cache.get('834031865224364032')
    
    setInterval(() => {
        const memberCount = guild.memberCount
        const channel = guild.channels.cache.get('835132454238814218')
        channel.setName(`User Count: ${memberCount.toLocaleString()}`)

    }, 10000)

    console.log('[ZYNTX]', 'MemberCount Module active.')
}