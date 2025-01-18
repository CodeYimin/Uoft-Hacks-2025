import { GoogleGenerativeAI } from "@google/generative-ai";
import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import "dotenv/config";
import { Schedule, ScheduleEvent } from "../types";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`The bot is ready! Logged in as ${client.user?.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Example "ping" command
  if (message.content.toLowerCase() === "ping") {
    message.reply("pong");
  }
});

client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error("Failed to log in:", err);
});

export async function notifyAssignment(
  event: ScheduleEvent,
  personality: string,
  schedule: Schedule
) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `I will provide you with a schedule in the following JSON format:
    {
      "events": [
        {
          "name": "Final Exam",
          "description": "Comprehensive assessment covering the entire course.",
          "type": "Exam",
          "startDate": "2025-01-25T14:00:00",
          "endDate": "2025-01-25T16:00:00"
        }
      ]
    }
    This project focuses on delivering personalized reminder messages based on cultural perspectives. You will receive an event from the schedule along with one of three personality types: "East Asian", "American", or "European". Your task is to craft a culturally aligned reminder for the upcoming event using the following guidelines:
    
    For the East Asian perspective, adopt a strict, no-nonsense tone. The message should motivate through pressure, discipline, and the weight of expectations. It should acknowledge the effort already invested in earlier events and stress the importance of following through to maintain consistency. For example: "Stop crying and go study! There is only one day left until your event.name. You didn't come all this way through lectures and quizzes just to fail now—make us proud, or don't bother coming home!"
  
    For the American perspective, create a relaxed and reassuring tone. The message should encourage without pressure, emphasizing positivity and a "you've got this" attitude. Connect the reminder to the progress made through earlier events and celebrate those milestones. For example: "Hey, don't stress! Your event.name is coming up soon, and you've already aced so many tasks like the quizzes and tutorials. Take it easy—you’re prepared, and you’ll do great!"
  
    For the European perspective, blend discipline with a relaxed, balanced approach. The message should stress the importance of preparation while acknowledging the value of relaxation and balance. Reflect on previous efforts and highlight how this event is part of the overall journey. For example: "Your event.name is coming up. You've done well in earlier quizzes and lectures—this is the next step forward. Take some time to prepare, but don't forget to rest and recharge—it’s important to stay focused and balanced."
  
    Each reminder should be creative, reflecting the personality type and tone, and should connect to the earlier events in the schedule. Adapt the wording to fit the specific event provided, and ensure it resonates with the recipient's perspective.
    
    IMPORTANT: Only provide me with the provide reminder, and nothing else surrounding it
    `;

  const data = `Event: ${
    event.name
  }, The remainder of the schedule: ${JSON.stringify(
    schedule
  )}, Personality_type: ${personality}`;

  try {
    const result = await model.generateContent([prompt, data]);
    const channel = await client.channels.fetch("1330002134271393816"); // Replace YOUR_CHANNEL_ID with the actual channel ID
    if (channel?.isTextBased()) {
      (channel as TextChannel).send(result.response.text() + " :woodspoon:");
    } else {
      console.error("Channel not found or not a text-based channel.");
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate reminder.");
  }
}
