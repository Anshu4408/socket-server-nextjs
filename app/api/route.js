import http from "http";
import user from "../models/user";
import { WebSocketServer } from "ws";
import mongoose from "mongoose";

const server = http.createServer();
const wss = new WebSocketServer({ server });
const clients = new Map();
await  mongoose.connect("mongodb+srv://Anshu45:Anshukumar8%40@cluster0.cse6amd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  
wss.on("connection", async(ws, req) => {
  const { searchParams } = new URL(req.url, "http://localhost");
  const username = searchParams.get("username");
  const myusername = searchParams.get("myusername");
  console.log("Client connected:", username);

  clients.set(username, ws);
   ws.on("message", async(data) => {

    console.log(`Message from ${username}:`, data.toString());

   
   for (const [uname, socket] of clients.entries()) {
                
                if (socket.readyState === 1 && (uname === username || uname === myusername)) {
                    socket.send(`${myusername}: ${data}`);
                   const update= await user.findOneAndUpdate(
                        { username: username},
                        { $push: { messages:`${myusername}: ${data}`  } },
                        { new: true }
                    );
                    const update2 = await user.findOneAndUpdate(
                        { username: myusername },
                        { $push: { messages: `${uname}: ${data}` } },
                        { new: true }
                    );
                }
              
            }

    });

    ws.on("close", () => {
      clients.delete(username);
      console.log("Disconnected:", username);
    });
});

const PORT =8080;
server.listen(PORT, () => {
  console.log(`✅ WebSocket server running on port ${PORT}`);
});