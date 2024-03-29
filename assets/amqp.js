const net = require("net");
const open = require("amqplib").connect(process.env.AMQP_URI);

const q = "tasks";
const connections = {};

// Publisher
open.then((conn) => {
  return conn.createChannel();
}).then((ch) => {
  return ch.assertQueue(q).then((ok) => {
    ch.sendToQueue(q, Buffer.from("##,imei:000000000000000,A;"));
    ch.sendToQueue(q, Buffer.from("000000000000000;"));
    ch.sendToQueue(q, Buffer.from("imei:000000000000000,tracker,191107094108,,F,014108.00,A,0254.41073,S,04145.42314,W,,;"));
  });
}).catch(console.warn);

/* // Consumer
open.then((conn) => {
  return conn.createChannel();
}).then((ch) => {
  return ch.assertQueue(q).then((ok) => {
    return ch.consume(q, (msg) => {
      if (msg !== null) {
        const data = msg.content.toString();
        const splited = data.split(",");

        let device;

        switch (true) {
          case /^\d{15};$/g.test(splited[0]):
            device = splited[0].split(";")[0];
            break;
          case /^##$/g.test(splited[0]):
            device = splited[1].split(":")[1];
            break;
          case /^imei:\d{15}$/g.test(splited[0]):
            device = splited[0].split(":")[1]
            break;
          default:
            break;
        }

        if (connections[device]) {
          connections[device].write(data);
        } else {
          connections[device] = new net.Socket();

          connections[device].connect(5001, "35.198.22.223", () => {

            connections[device].write(data);

            // connections[device].setTimeout(3 * 1000);

            connections[device].on("close", () => {
              console.log("close");
            });

            connections[device].on('timeout', () => {
              console.log("timeout");
              // connections[device].end();
              // connections[device].destroy();
              // delete connections[device];
            });


          });
        }

        // console.log(device);
        ch.ack(msg);
      }
    });
  });
}).catch(console.warn); */