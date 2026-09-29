Tiny HTTP Server

A minimal HTTP server built using Node.js's built-in net module.

It does not use Node's http module or Express.

How to Run

Make sure Node.js is installed, then run:

node server.js

The server listens on port 4221:

tiny-http listening on port 4221

Test with curl

In another terminal:

curl -v http://localhost:4221/

You should see output similar to:

- Trying 127.0.0.1:4221...
- Connected to localhost (127.0.0.1) port 4221
  > GET / HTTP/1.1
  > Host: localhost:4221
  > User-Agent: curl/8.x.x
  > Accept: _/_
  >
  > < HTTP/1.1 200 OK
  > <
- Connection #0 to host localhost left intact

The exact output may differ depending on your version of curl.

The important part is that the server responds with:

HTTP/1.1 200 OK\r\n\r\n

The call to socket.end() sends this response and then closes the connection, so curl exits cleanly.

How does my server know where a request ends?

Strictly speaking, the server does not currently need to know where the HTTP request ends.

The server listens for the socket's data event:

socket.on("data", (data) => {
socket.end("HTTP/1.1 200 OK\r\n\r\n");
});

As soon as any data arrives from the client, it sends the response and closes the connection.

This works for this simple exercise because the server doesn't actually parse the request. It doesn't inspect the HTTP method, path, headers, or body.

But how would a real HTTP server know?

TCP provides a continuous byte stream. It does not divide that stream into HTTP requests for us.

For example, an HTTP request might look like:

GET / HTTP/1.1\r\n
Host: localhost:4221\r\n
\r\n

For an HTTP request with no body, the end of the headers is marked by:

\r\n\r\n

A server implementing HTTP parsing could therefore accumulate TCP data until it finds that sequence.

However, TCP is allowed to split or combine data however it wants. The request might arrive as one data event or several:

"GET / HTTP/1.1\r\nHos"

followed by:

"t: localhost:4221\r\n\r\n"

Therefore, a data event is not the same thing as an HTTP request.

For requests with bodies, HTTP has additional framing rules. For example, Content-Length can tell the server how many bytes belong to the body.

So the key idea is:

TCP gives us a stream of bytes. HTTP defines how those bytes are structured into requests and responses.

This server skips HTTP parsing entirely: it simply responds when the client sends data and then closes the connection.
