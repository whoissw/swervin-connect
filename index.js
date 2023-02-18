const axios = require('axios')
const colors = require('colors')
const Discord = require("discord.js")
const config = require('./config.json')
const client = new Discord.Client({ intents: 32767 })

/**
 * @param {Discord.Message} message
 */

client.on("ready", async (message) => {
    console.log(colors.blue('[#] Bot iniciado com sucesso, update sendo realizado dentro de segundos.'))

    var data = { players: "" }

    async function message() {

        async function update_info() {

            await axios.get(`http://${config.Server.serverIp}:${config.Server.serverPort}/players.json`).then(response => {
                console.log(colors.green('[+] Update realizado com sucesso.'))
                data.players = response.data.length
            }).catch(err => data.players = -1)
        }

        await update_info()

        await client.channels.cache.get(config.Server.channel).bulkDelete(100).catch(() => console.error)
        const guildInfo = client.guilds.cache.get(config.Server.serverId)

        if (data.players === -1) {
            var embed = new Discord.MessageEmbed()

                .setTitle(guildInfo.name)
                .setColor('#2f3136')
                .addField(`> __Players:__`, `\`\`\`🎮 0 \`\`\``, true)
                .addField('> __Status:__', '```🔴 Offline ```', true)
                .addField('> __IP Servidor:__', `\`\`\`${config.Server.serverConnect}\`\`\``, false)
                .setThumbnail(guildInfo.iconURL({ dynamic: true }))

        } else {
            var embed = new Discord.MessageEmbed()

                .setTitle(guildInfo.name)
                .setColor('#2f3136')
                .addField(`> __Players:__`, `\`\`\`🎮 ${data.players} \`\`\``, true)
                .addField('> __Status:__', '```🟢 Online ```', true)
                .addField('> __IP Servidor:__', `\`\`\`${config.Server.serverConnect}\`\`\``, false)
                .setThumbnail(guildInfo.iconURL({ dynamic: true }))
        }

        const btn = new Discord.MessageButton()

            .setStyle("LINK")
            .setLabel("Conectar-se")
            .setEmoji("986324062827581460")
            .setURL("https://discord.gg/W3n8N6mxbF")

        const row = new Discord.MessageActionRow().addComponents([btn])

        await client.channels.cache.get(config.Server.channel).send({
            components: [row],
            embeds: [embed]
        }).then(msg => {

            setInterval(async () => {
                if (data.players === -1) {
                    embed.fields[0].value = `\`\`\`🎮 0 \`\`\``
                    embed.fields[1].value = `\`\`\`🔴 Offline \`\`\``
                    await msg.edit({ embeds: [embed] })
                } else {
                    embed.fields[0].value = `\`\`\`🎮 ${data.players} \`\`\``
                    embed.fields[1].value = `\`\`\`🟢 Online \`\`\``
                    await msg.edit({ embeds: [embed] })
                }
                async function update_info() {
                    await axios.get(`http://${config.Server.serverIp}:${config.Server.serverPort}/players.json`).then(response => {
                        console.log(colors.green('[+] Update realizado com sucesso.'))
                        data.players = response.data.length
                    }).catch(err => data.players = -1)
                }
                await update_info()
            }, 60000);
        })
    }
    message()
})

client.login(config.token);