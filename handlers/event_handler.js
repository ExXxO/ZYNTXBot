const fs = require('fs');

module.exports = (zyntx, Discord) => {
    const load_dir = (dirs) => {
        const events_files = fs.readdirSync(`./events/${dirs}`).filter(file => file.endsWith('js'));

        for(const file of events_files) {
            const event = require(`../events/${dirs}/${file}`);
            const event_name = file.split('.')[0];
            zyntx.on(event_name, event.bind(null, Discord, zyntx));
            console.log('[ZYNTX]', `Registering Event ${event_name}`);

        }
    }

    ['client', 'guild'].forEach(e => load_dir(e));
}