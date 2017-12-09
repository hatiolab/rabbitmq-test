#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const uuidv4 = require('uuid/v4');

var args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

amqp.connect('amqp://hatiolab:hatiolab@mq.hatiolab.com', function(err, conn) {
  if(err) {
    console.error(err);
    return;
  }  

  conn.createChannel(function(err, ch) {
    ch.assertQueue('', {exclusive: true}, function(err, q) {
      var corr = generateUuid();
      var num = parseInt(args[0]);

      //console.log(' [x] Requesting fib(%d)', num);


      ch.consume(q.queue, function(msg) {
        if (msg.properties.correlationId === corr) {
          console.log('%s [.] Got %s',corr, msg.content.toString());
          setTimeout(function() { conn.close(); process.exit(0) }, 500);
        }
      }, {noAck: true});

      let table = []
      for(let i = 0;i < num;i++) {
        table.push({
          goodQty: Math.floor(Math.random() * 500),
          badQty: Math.floor(Math.random() * 50)
        })
      }

       ch.sendToQueue('rpc_queue', new Buffer(JSON.stringify(table)), {correlationId:corr, replyTo:q.queue});
//      ch.sendToQueue('rpc_queue',
//        new Buffer(num.toString()),
//        { correlationId: corr, replyTo: q.queue });
//      ch.sendToQueue('rpc_queue',
//        new Buffer(num.toString()),
//        { correlationId: corr, replyTo: q.queue });
});
});
});

function generateUuid() {
return uuidv4().toString();

//  return Math.random().toString() +
//         Math.random().toString() +
//         Math.random().toString();
}
