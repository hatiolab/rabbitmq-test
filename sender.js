#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://hatiolab:hatiolab@mq.hatiolab.com', function(err, conn) {
  if(err) {
    console.error(err);
    return;
  }

  conn.createChannel(function (err, ch) {
    var q = 'hello';

    ch.assertQueue(q, { durable: false });

    for(var i = 0;i < 10000;i++) {
        ch.sendToQueue(q, new Buffer('Hello World!'));
    }
    console.log(" [x] Sent 'Hello World!'");
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 5000);  
});

