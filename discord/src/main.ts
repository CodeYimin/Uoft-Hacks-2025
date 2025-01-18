import { Client, GatewayIntentBits, Message } from "discord.js";
import "dotenv/config";
import { Assessment } from "./types";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const personality = "ASIAN";

client.on("ready", () => {
  console.log(`The bot is ready! Logged in as ${client.user?.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  // Example "ping" command
  if (message.content.toLowerCase() === "ping") {
    message.reply("pong");
  }

  // Trigger the notifyAssessment function with a test assessment
  if (message.content.toLowerCase() === "test assignment") {
    const testAssignment: Assessment = {
      name: "Math Quiz",
      type: "Assignment",
      date: "2025-02-10",
    };

    notifyAssessment(message, testAssignment);
  }
});

client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error("Failed to log in:", err);
});

function notifyAssessment(message: Message, assessment: Assessment): void {
  if (personality === "ASIAN") {
    const reply = `Stop crying and go study! There is only one day left until your ${assessment.name}. You didn’t come all the way there to waste time — make us proud, or else don’t bother coming home!`;

    message.reply(reply);
  }
}
