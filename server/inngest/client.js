const { Inngest } = require("inngest");


const inngest = new Inngest({
  id: "retail-portal",
  eventKey: process.env.INNGEST_EVENT_KEY || "local",
});

module.exports = { inngest };
