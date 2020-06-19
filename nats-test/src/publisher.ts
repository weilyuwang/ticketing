import nats from "node-nats-streaming";

console.clear();

// community convention: use stan to indicate a nats client
const stan = nats.connect("ticketing", "abc", {
    url: "http://localhost:4222",
});

stan.on("connect", () => {
    console.log("Publisher connected to NATS");

    // need to convert JSON into string before send to NATS streaming
    const data = JSON.stringify({
        id: "123456",
        title: "concert",
        price: 10000,
    });

    // publish data to channel ticket:create
    stan.publish("ticket:created", data, () => {
        console.log("Event published");
    });
});
