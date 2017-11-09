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

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    var count = 0;
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s(%d)", msg.content.toString(), count++);
    }, {noAck: true});        
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 50000);  
});

