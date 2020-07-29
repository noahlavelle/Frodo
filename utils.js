// A file for reused code like generating embeds

const { MessageEmbed } = require('discord.js')

function generateEmbed(title, description, color, timestamp, fields, image, thumnail) {
    const embed = new MessageEmbed()
        .setColor(color);
    if (description != false) embed.setDescription(description)
    if (title != false) embed.setTitle(title);
    if (timestamp == true) embed.setTimestamp();
    if (fields != false) embed.addFields(fields)
    if (image != false) embed.setImage(image)
    if (thumnail != false) embed.setThumbnail(thumnail)
    return embed
}

module.exports.generateEmbed = generateEmbed