#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://hatiolab:hatiolab@mq.hatiolab.com', function(err, conn) {
  if(err) {
    console.error(err);
    return;
  }

  conn.createChannel(function (err, ch) {
    var ex = 'amq.topic';

    ch.assertExchange(ex, 'topic', { durable: true });

    setInterval(() => {
      let x = Math.random() * 500;
      let y = Math.random() * 500;
      ch.publish(ex, 'location', new Buffer('{"x":' + x + ', "y":' + y + '}'));
    }, 500);
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 500000);  
});
