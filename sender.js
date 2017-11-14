#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://hatiolab:hatiolab@mq.hatiolab.com', function(err, conn) {
  if(err) {
    console.error(err);
    return;
  }

  conn.createChannel(function (err, ch) {
    var q = 'movement';
    var count = 1;

    ch.assertQueue(q, { durable: true });

    setInterval(() => {
      let x = Math.random() * 500 + 700;
      let y = Math.random() * 500 + 200;

      let location = {x, y}
      count++;
      ch.sendToQueue(q, new Buffer(JSON.stringify({location, count})));
    }, 550);

    setInterval(() => {
      let rotation = Math.random() * Math.PI * 2;
      ch.sendToQueue(q, new Buffer(JSON.stringify({rotation})));
    }, 500);

    setInterval(() => {
      let color = {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255)
      }

      ch.sendToQueue(q, new Buffer(JSON.stringify({color})));
    }, 490);
  });
});

