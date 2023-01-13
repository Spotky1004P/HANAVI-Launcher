// Work in progress
const logger = require('./loggerutil')('%c[DiscordWrapper]', 'color: #7289da; font-weight: bold')

const {Client} = require('discord-rpc-patch')

let client
let activity

/** @type {string[]} */
let detailRotates = [];
setInterval(() => {
    if (activity && client) {
        const curIdx = detailRotates.findIndex(v => v === activity.details);
        const nextIdx = (curIdx + 1) % detailRotates.length;
        activity.details = detailRotates[nextIdx];
        client.setActivity(activity)
    }
}, 10000);
exports.initRPC = function(genSettings, servSettings, initialDetails = '하나비 실행 중 ...'){
    client = new Client({ transport: 'ipc' });
    
    detailRotates = [initialDetails];
    activity = {
        details: detailRotates[0],
        state: 'Server: ' + servSettings.shortId,
        largeImageKey: servSettings.largeImageKey,
        largeImageText: servSettings.largeImageText,
        smallImageKey: genSettings.smallImageKey,
        smallImageText: genSettings.smallImageText,
        startTimestamp: new Date().getTime(),
        instance: false
    }

    client.on('ready', () => {
        logger.log('Discord RPC Connected')
        client.setActivity(activity)
    })
    
    client.login({clientId: genSettings.clientId}).catch(error => {
        if(error.message.includes('ENOENT')) {
            logger.log('Unable to initialize Discord Rich Presence, no client detected.')
        } else {
            logger.log('Unable to initialize Discord Rich Presence: ' + error.message, error)
        }
    })
}

exports.updateDetails = function(details){
    if (typeof details === "string") {
        detailRotates = [details];
    } else {
        detailRotates = [...details];
    }
    activity.details = detailRotates[0];
    client.setActivity(activity)
}

exports.shutdownRPC = function(){
    if(!client) return
    client.clearActivity()
    client.destroy()
    client = null
    activity = null
}