#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://hatiolab:hatiolab@mq.hatiolab.com', function(err, conn) {
  if(err) {
    console.error(err);
    return;
  }

  conn.createChannel(function (err, ch) {
    var ex = 'amq.topic';
    var count = 1;

    ch.assertExchange(ex, 'topic', { durable: true });

    setInterval(() => {
      let table = []
      for(let i = 0;i < 4;i++) {
        table.push({
          goodQty: Math.floor(Math.random() * 500),
          badQty: Math.floor(Math.random() * 50)
        })
      }

      ch.publish(ex, 'table', new Buffer(JSON.stringify(table)));
    }, 1000);
  });
});

