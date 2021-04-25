const memberCounter = require('../../counters/member-counter');

module.exports = (Discord, zyntx) => {
    zyntx.user.setPresence({
        activity: {
            name: 'Bruno hat nen ganz kleinen 🥒',
            type: 0
        }
    });

    memberCounter(zyntx);

    console.log('[ZYNTX]', 'Bot is ready now.');
}