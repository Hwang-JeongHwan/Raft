var dgram = require("dgram");

var server = dgram.createSocket("udp4");
const Random = require('./func');
const HOST = 'localhost';
server.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  server.close();
});

var before_id = 0;
var before_id_check_term = 0;
var cnt = 0;
var before_term = 1;
var commit_msg = {};
var leader_port = 0;
/*
server.on("message", function (msg, rinfo) {
  console.log("server got: " + msg + " from " +
    rinfo.address + ":" + rinfo.port);
});
*/
var bf = 0 ;
server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  //console.log(rinfo.port);
  console.log(rinfo.port);
  console.log('commit_msg\n\n\n\n',commit_msg);
  //console.log('fullcommit\n\n\n\n\n',full_commit)

  if (8000<rinfo.port&& rinfo.port<9000){
    
    var i = JSON.parse(msg); // key value쌍으로 데이터에 접근하기 위해 제이슨으로 변환 
    console.log('app',i);
    console.log(`key = ${i.key} value = ${i.value}`);

    var j = JSON.stringify(i); //메시지는 string or buffer 형태여야 하기 때문에 string으로 변환 
    /*if (i.first == 'first'){
      server.send(j,8001,HOST,(err,bytes)=>{
        if (err) throw err;
        console.log('send first');
      });
    }*/
    console.log(j);
    if (i.interval == 'interval'){ //interval이 오면 interval을 다시 보내줌 
      server.send(j,8001,HOST,(err,bytes)=>{
        if (err) throw err;
        console.log('interval');

      })
    }
    else if(i.interval != 'interval' && i.commit !='commit') {
      server.send(j, 9001, HOST, function(err, bytes) {
        if (err) throw err;
        console.log('Message Handler sent to ' + HOST +':'+ 9001);
  
        console.log(j);
  
    });
      server.send(j, 9002, HOST, function(err, bytes) {
        if (err) throw err;
        console.log('Message Handler sent to ' + HOST +':'+ 9002);
        console.log(j);

    });

      server.send(j, 9003, HOST, function(err, bytes) {
        if (err) throw err;
        console.log('Message Handler sent to ' + HOST +':'+ 9003);
        console.log(j);

    });
      server.send(j, 9004, HOST, function(err, bytes) {
        if (err) throw err;
        console.log('Message Handler sent to ' + HOST +':'+ 9004);
        console.log(j);

    });
      server.send(j, 9005, HOST, function(err, bytes) {
        if (err) throw err;
        console.log('Message Handler sent to ' + HOST +':'+ 9005);
        console.log(j);

    });
    
    }

  }
  else if(9000<rinfo.port&& rinfo.port<10000){
    var i = JSON.parse(msg);
    //console.log('orderer',i);
    //console.log(`id = ${i.orderer_ID} state = ${i.state} term = ${i.term}`);
    console.log('messagefrom orderer',i);
    console.log('i.state',i.state);
    console.log('bf',bf);
    if(i.rejoin_state == 'rejoin'){
       
      server.send(msg,9001,HOST, function(err,bytes){
        console.log('rejoin message send to orderer1');

      });
        
      server.send(msg,9002,HOST, function(err,bytes){
        console.log('rejoin message send to orderer2');

      });
      server.send(msg,9003,HOST, function(err,bytes){
        console.log('rejoin message send to orderer3');

      });
        
      server.send(msg,9004,HOST, function(err,bytes){
        console.log('rejoin message send to orderer4');

      });
        
      server.send(msg,9005,HOST, function(err,bytes){
        console.log('rejoin message send to orderer5');
      });

     

    }
    // if(i.state == 'rejoin'){
      
    //   server.send(msg,9001,HOST, function(err,bytes){
    //     console.log('rejoin message send to orderer1');

    //   });
        
    //   server.send(msg,9002,HOST, function(err,bytes){
    //     console.log('rejoin message send to orderer2');

    //   });
    //   server.send(msg,9003,HOST, function(err,bytes){
    //     console.log('rejoin message send to orderer3');

    //   });
        
    //   server.send(msg,9004,HOST, function(err,bytes){
    //     console.log('rejoin message send to orderer4');

    //   });
        
    //   server.send(msg,9005,HOST, function(err,bytes){
    //     console.log('rejoin message send to orderer5');
    //   });


    // }
    if (i.msg == 'copy'){
      console.log(i);
    //  var interval = setInterval(() => {
        

      server.send(msg,9001,HOST, function(err,bytes){
        console.log('copy message send to orderer1');

      });
        
      server.send(msg,9002,HOST, function(err,bytes){
        console.log('copy message send to orderer2');

      });
      server.send(msg,9003,HOST, function(err,bytes){
        console.log('copy message send to orderer3');

      });
        
      server.send(msg,9004,HOST, function(err,bytes){
        console.log('copy message send to orderer4');

      });
        
      server.send(msg,9005,HOST, function(err,bytes){
        console.log('copy message send to orderer5');
      });
      
    }
    if(i.rejoincopy=='send'){
      server.send(msg,i.rejoinport,HOST,()=>{
        console.log('rejoincopy send to rejoin node',msg);
      })
    }
    if(i.copy =='ok'){
      server.send(msg,i,leaderport,HOST,()=>{
        console.log('copy ok',msg);

      })
    }
    if(i.finish == 'finish'){
      server.send(msg,i.leaderport,HOST,()=>{
        console.log('send finish',msg);
      })
    }
    if (i.orderer_state == 'ok'){
      console.log(i);
    //  var interval = setInterval(() => {
        

      server.send(msg,i.port,HOST, function(err,bytes){
        console.log('ok message send to leader');

      });
    
        /*
      server.send(msg,9002,HOST, function(err,bytes){
        console.log('ok message send to orderer2');

      });
      server.send(msg,9003,HOST, function(err,bytes){
        console.log('ok message send to orderer3');

      });
        
      server.send(msg,9004,HOST, function(err,bytes){
        console.log('ok message send to orderer4');

      });
        
      server.send(msg,9005,HOST, function(err,bytes){
        console.log('ok message send to orderer5');
      });*/

      
    }
    if(i.commit == 'commit'){ //여기가 문제인듯 commit일떄 메시지가 안가짐...
      if(i.state == 'leader'){
        commit_msg.key = i.key;
        commit_msg.value = i.value;
        commit_msg.cnt = i.cnt;
        leader_port = i.port
        //full_commit+=commit_msg;
        
      }
      console.log('commit_msg=',commit_msg);
      
      server.send(msg,9001,HOST, function(err,bytes){
        console.log('commit message send to leader');

      });
    
      server.send(msg,9002,HOST, function(err,bytes){
        console.log('commit message send to leader');

      });
      server.send(msg,9003,HOST, function(err,bytes){
        console.log('commit message send to leader');

      });
      server.send(msg,9004,HOST, function(err,bytes){
        console.log('commit message send to leader');

      });
      server.send(msg,9005,HOST, function(err,bytes){
        console.log('commit message send to leader');

      });
      server.send(msg,8001,HOST,(err,bytes)=>{
        console.log('commit message send to app');

      });

    }

    if(i.state == 'leader'){
        cnt = 0 ;
        console.log('cnt = 0 ',cnt);
    }
    /*if(i.state == undefined){
      console.log('if(i.state == undefined)');
    }
    if(i.state != undefined){
      console.log('i0f(i.state != undefined)');
    }*/
/*function check_term(before_id_check_term,i) {
  if(before_id_check_term != i){

  }

}*/
    if(commit_msg.key == i.key && commit_msg.value == i.value && commit_msg.cnt == i.cnt &&i.state != 'rejoin'&&i.state != 'dead'&&i.state!='follower' ){ 
      //candidate를 선출하기위해 마지막으로 커밋된 메시지와 candidate가 되려하는 오더러 장부의 마지막 메시지를 비교
      console.log('you are match commit_msg',i);
      if(before_id_check_term != i.id){ //텀을 체크하는 아이디와 i.id(메시지로받은 id)가 같지않으면
        before_id_check_term = i.id; //다음 들어오는 메시지의 아이디도 체크해야하므로 변경
        console.log('before_id_check_term = ',before_id_check_term,i.term);
  
        if(before_term<i.term){ //이전의 텀보다 현재 들어온 메시지의 텀이 더 크면 
          before_term = i.term; //바꿔줌 
          console.log('before_id_check_term=',before_id_check_term,'beforeterm=',before_term);
          if(i.state !='leader'){
          var you_are_candidate = {"candidate":i.id}; //텀이 제일 높은 오더러가 candidate가 되 ㅁ
          var candidate_str=JSON.stringify(you_are_candidate);
  
          server.send(candidate_str,9001,HOST,()=>{
  
            console.log('send candidate is ',9001,i.id);
            console.log('candidate = ',candidate_str);
  
          });
          
          server.send(candidate_str,9002,HOST,()=>{
  
            console.log('send candidate is ',9002,i.id);
            console.log('candidate = ',candidate_str);
  
          });
          server.send(candidate_str,9003,HOST,()=>{
  
            console.log('send candidate is ',9003,i.id);
            console.log('candidate = ',candidate_str);
  
          });
          server.send(candidate_str,9004,HOST,()=>{
  
            console.log('send candidate is ',9004,i.id);
            console.log('candidate = ',candidate_str);
  
          });
          server.send(candidate_str,9005,HOST,()=>{
  
            console.log('send candidate is ',9005,i.id);
            console.log('candidate = ',candidate_str);
  
          });
        }
        
  
      }
      }
    }
    
    if(before_id != i.id ){ //오더러중 리더가 없으면 리더가 없다는 메시지를 전송
        before_id = i.id;
        console.log(before_id);
        
        if (i.state != 'leader' && i.heartbit == 'heartbit'){
            cnt+=1;
            console.log('cnt',cnt);
            if (cnt == 13){
              cnt = 0;
                
              var noleader = '{"leader":"noleader"}';
              server.send(noleader,9001,HOST,()=>{
                  console.log('send',noleader);
                });
              server.send(noleader,9002,HOST,()=>{
                console.log('send',noleader);
                
              });
              server.send(noleader,9003,HOST,()=>{
                console.log('send',noleader);
              });
              server.send(noleader,9004,HOST,()=>{
                console.log('send',noleader);
              });
              server.send(noleader,9005,HOST,()=>{
                console.log('send',noleader);
            });
            }
        }
        if (i.state == 'leader'){
            cnt = 0;
        }
       


    }


    
  /*
    if (i.term >= bf){
      
      var j = JSON.stringify(i);//메시지는 string or buffer 형태여야 하기 때문에 string으로 변환 
    
      server.send(j, rinfo.port, HOST, function(err, bytes) {
        if (err) throw err;
        console.log('Message Handler sent to ' + HOST +':'+ rinfo.port);
        console.log(j);
    //  client.close();
        bf = i.term;
    
    });
  
      
    }
  */  
    
  }
  
  else{
    var i = JSON.parse(msg);
    console.log('app',i);
    console.log(`id = ${i.peer_ID}`);
  
  }

  
});

server.bind({
    address: 'localhost',
    port: 8000,
    
  });