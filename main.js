import net from "net";

const server = net.createServer((socket) => {
  socket.on("error", (error) => {
    console.log(error.toString());
  });

  socket.on("data", (data) => {
    socket.end("HTTP/1.1 200 OK\r\n\r\n");
  });
});

server.listen(4221, () => {
  console.log("tiny-http listening on port 4221");
});
