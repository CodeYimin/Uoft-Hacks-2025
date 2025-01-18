import { GoogleGenerativeAI } from "@google/generative-ai";
import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import "dotenv/config";
import { Schedule, ScheduleEvent } from "../types";

const runGenAi = true;

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
  personality: "nice" | "mean" | "stern",
  schedule: Schedule
) {
  if (runGenAi) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

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
      This project focuses on delivering personalized reminder messages based on cultural perspectives. You will receive an event from the schedule along with one of three personality types: "mean", "nice", or "stern". Your task is to craft a culturally aligned reminder for the upcoming event using the following guidelines:
      
      For the mean perspective, adopt a strict, no-nonsense tone. The message should motivate through pressure, discipline, and the weight of expectations. It should acknowledge the effort already invested in earlier events and stress the importance of following through to maintain consistency."
    
      For the nice perspective, create a relaxed and reassuring tone. The message should encourage without pressure, emphasizing positivity and a "you've got this" attitude. Connect the reminder to the progress made through earlier events and celebrate those milestones."
    
      For the stern perspective, blend discipline with a relaxed, balanced approach. The message should stress the importance of preparation while acknowledging the value of relaxation and balance. Reflect on previous efforts and highlight how this event is part of the overall journey."
    
      Each reminder should be creative, reflecting the personality type and tone, and should connect to the earlier events in the schedule. Adapt the wording to fit the specific event provided, and ensure it resonates with the recipient's perspective.
      
      Each reminder should be unique from the previous ones, providing a fresh perspective for the upcoming event.

      You are creating discord messages, so feel free to use a markdown format that is compatible with Discord messages to enhance the looks of your message like bold, italics, underline, etc. However, do not use the code block markdown feature. You may use Block Quotes. Additionally, remember that this message is being sent to one single person, so it should not be addressed to a plural recipient.

      Sign the message off as "Mom", or any other variation of a mother.

      IMPORTANT: Only provide me with the provide reminder, and nothing else surrounding it
      `;

    const data = `Event: ${
      event.name
    }, The remainder of the schedule: ${JSON.stringify(
      schedule
    )}, Personality_type: ${personality}`;

    try {
      const result = await model.generateContent([prompt, data]);
      const channel = await client.channels.fetch("1330002134271393816"); 
      if (channel?.isTextBased()) {
        (channel as TextChannel).send(result.response.text() + " <:woodspoon:1330104719246491690>");
      } else {
        console.error("Channel not found or not a text-based channel.");
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw new Error("Failed to generate reminder.");
    }
  } else {
    const hardCodedMessages = {
      mean: [
        `**📚 Stop crying and go study!** There is only *one day* left until your **${event.name}**. You didn't come all this way through lectures and quizzes just to fail now-make us proud, or don't bother coming home!`,
        `⏳ **Time is running out!** Your **${event.name}** is tomorrow. It's not just about you-*everyone is counting on your success*. Stay focused and give it your all!`,
        `🎯 **Your ${event.name} is almost here!** Remember the effort you've put in so far-don't let it go to waste. This is the final push, so **work hard**!`,
        `🔔 **Final Reminder:** Your **${event.name}** is approaching fast. No excuses now-study harder than ever before, and show your dedication!`,
        `🔥 **It's now or never!** Your **${event.name}** is just around the corner. Push through the challenges, focus on the goal, and make us proud!`,
      ],
      nice: [
        `🎉 **Hey, don't stress!** Your **${event.name}** is coming up soon, and you've already aced so many tasks like the quizzes and tutorials. Take it easy-you're prepared, and you'll do great!`,
        `✅ **Your ${event.name} is just around the corner!** You've been doing an amazing job so far-keep it up and trust in your preparation!`,
        `🌟 **Relax and stay positive!** The **${event.name}** is approaching, and you've shown so much progress already. **You've got this!**`,
        `🏆 **Great work so far!** The **${event.name}** is almost here. Stay confident-you've been consistent and prepared, so there's no need to worry!`,
        `💪 **You're doing amazing!** The **${event.name}** is coming soon, and your hard work will pay off. Believe in yourself-you've got this!`,
      ],
      stern: [
        `📚 **Your ${event.name} is coming up.** You've done well in earlier quizzes and lectures-this is the next step forward. Take some time to prepare, but don't forget to rest and recharge-it's important to stay **focused and balanced**.`,
        `⚖️ **Preparation is key, but so is balance.** Your **${event.name}** is near-review your work, stay calm, and trust in your efforts so far.`,
        `🛤️ **The ${event.name} is part of your journey.** Reflect on your progress, prepare diligently, and remember to maintain a steady balance between work and rest.`,
        `🌅 **Stay calm and prepare!** Your **${event.name}** is almost here. Remember to balance your focus with relaxation-it's all part of the process.`,
        `🎯 **Focus on the goal!** Your **${event.name}** is approaching. Trust in your preparation and take it one step at a time while maintaining your calm and focus.`,
      ],
    };
  
    try {
      const random = Math.floor(Math.random() * (4 + 1));
      console.log(`THE RANDOM NUMBER IS : ${random}`)
      const messages = hardCodedMessages[personality] || [];
      const message =
        messages[random];
  
      const channel = await client.channels.fetch("1330002134271393816");
      if (channel?.isTextBased()) {
        (channel as TextChannel).send(message + " <:woodspoon:1330104719246491690>");
      } else {
        console.error("Channel not found or not a text-based channel.");
      }
    } catch (error) {
      console.error("Error sending hardcoded message:", error);
      throw new Error("Failed to send hardcoded reminder.");
    }
  }
}
