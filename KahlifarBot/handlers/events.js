const { readdirSync } = require("fs")
const logger = require("../handlers/logger")

// Require all events decalred in ../events
module.exports = (client) => {
  try {
  readdirSync("./events/").forEach((file) => {
    const events = readdirSync("./events/").filter((file) =>
      file.endsWith(".js")
    );

    for (let file of events) {
      let pull = require(`../events/${file}`);

      if (pull.name) {
        client.events.set(pull.name, pull);
      } else {
        continue;
      }
    }
  });
  } catch (e) {
    logger.error(e)
  }
}
