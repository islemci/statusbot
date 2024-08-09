const { ActivityType } = require('discord.js');


module.exports = (bot) => {
  bot.on('ready', async () => {
    console.log(`Starting as: ${bot.user.tag}`);
    const statuses = [
      { name: 'with modules', type: ActivityType.Playing },
      { name: 'the server status', type: ActivityType.Watching },
      { name: 'API requests', type: ActivityType.Listening },
      { name: 'musti!', type: ActivityType.Watching },
    ];  
    let currentIndex = 0;
    setInterval(() => {
      const status = statuses[currentIndex];
      bot.user.setActivity(status.name, { type: status.type });
      currentIndex = (currentIndex + 1) % statuses.length;
    }, 10000);
  });
};