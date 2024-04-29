import { ChatClient } from "../services/ChatClient.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// import users from "./data/users.json";
const importUserId = () => {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const usersInfo = JSON.parse(
    fs.readFileSync(path.resolve(dirname, "./data/users.json"), "utf8")
  );
  // console.log(usersInfo)
  return usersInfo.map((user) => user.id);
};

// create channel with user
const createChannel = async (channelName, userIdList, chatClient) => {
  console.log(
    `Creating Channel "${channelName}" with following user id: ${userIdList}`
  );
  await chatClient.connect();
  const channel = chatClient.client.channel("messaging", channelName, {
    name: "UI Improvements",
    members: userIdList,
  });
  const res = await channel.create();
  console.log("Adding users to the channel...");

  const addMembersResponse = await channel.addMembers(userIdList);
  // console.log(addMembersResponse.members);
  console.log(
    `Channel "${channelName}" created successfully with users: ${userIdList}`
  );
};

// import conversation history
const importChatHistory = async (channelName, chatClient) => {
  console.log("Importing conversation history...");
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const chatHistory = JSON.parse(
    fs.readFileSync(path.resolve(dirname, "./data/chatHistory.json"), "utf8")
  );

  // due to the getStream package could only create ONE socket for each process, we are executing other js script to send message
  const fetchMessage = (scriptPath, channelName, message) => {
    execSync(
      `node --env-file=.env ${scriptPath} ${channelName} "${message}"`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr != "") console.error(`stderr: ${stderr}`);
        console.log(`stdout: ${stdout}`);
      }
    );
  };
  // fetchMessage("./automation/utils/userASendMessage.js", "ui", "This is userA speaking...");

  chatHistory.forEach(({ id, text }) => {
    if (id === "userA") {
      fetchMessage("./automation/utils/userASendMessage.js", channelName, text);
    } else if (id === "userB") {
      fetchMessage("./automation/utils/userBSendMessage.js", channelName, text);
    } else if (id === "userC") {
      fetchMessage("./automation/utils/userCSendMessage.js", channelName, text);
    } else if (id === "userD") {
      fetchMessage("./automation/utils/userDSendMessage.js", channelName, text);
    } else if (id === "userE") {
      fetchMessage("./automation/utils/userESendMessage.js", channelName, text);
    } else if (id === "userF") {
      fetchMessage("./automation/utils/userFSendMessage.js", channelName, text);
    } else {
      console.error("Invalid user id.");
    }
  });

  console.log("Conversation history imported successfully.");
};

const main = async () => {
  try {
    // collect users
    // const userIdList = importUserId();

    // create channel
    const channelName = "ui";
    const chatClient = new ChatClient();
    // await chatClient.connect();
    // await createChannel(channelName, userIdList, chatClient);

    // import conversation history
    await importChatHistory(channelName, chatClient);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

await main();
console.log("Finished Execution of createHistory.js");
process.exit(0);