#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://hatiolab:hatiolab@mq.hatiolab.com', function(err, conn) {
    if(err) {
        console.error(err);
        return;
      }  

  conn.createChannel(function(err, ch) {
    var q = 'rpc_queue';

    ch.assertQueue(q, {durable: false});
    ch.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    ch.consume(q, function reply(msg) {

/*
      var n = parseInt(msg.content.toString());

      console.log("%s [.] fib(%d)",msg.properties.correlationId, n);

      var r = fibonacci(n);

      ch.sendToQueue(msg.properties.replyTo,
        new Buffer(r.toString()),
        {correlationId: msg.properties.correlationId});
*/
    console.log("%s [.] %s", msg.properties.correlationId, msg.content.toString());

    ch.sendToQueue(msg.properties.replyTo, new Buffer(msg.content.toString()), {correlationId:msg.properties.correlationId});

      ch.ack(msg);
    });
  });
});

function fibonacci(n) {
  if (n === 0 || n === 1)
    return n;
  else
    return fibonacci(n - 1) + fibonacci(n - 2);
}