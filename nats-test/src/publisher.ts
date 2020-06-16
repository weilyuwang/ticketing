import nats from "node-nats-streaming";

// community convention: use stan to indicate a nats client
const stan = nats.connect("ticketing", "abc", {
    url: "http://localhost:4222",
});

stan.on("connect", () => {
    console.log("Publisher connected to NATS");
});
