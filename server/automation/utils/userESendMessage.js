import { UserE } from "../userClient/UserClient.js";

const sendMessage = async (channelName, text) => {
  console.log("Sending message...");
  await UserE.connect();
  const channel = UserE.client.channel("messaging", channelName);
  const res = await channel.sendMessage({
    text,
  });
  console.log("Message sent successfully!");
}

// parse the channel name and message from the command line arguments
const args = process.argv.slice(2);
const channelName = args[0];
const message = args[1];
await sendMessage(channelName, message);

process.exit(0);
