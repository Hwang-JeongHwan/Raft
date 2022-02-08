const PORT = 8000;
const HOST = '127.0.0.1';
const Random = require('./func')
const dgram = require('dgram');
const mergeJSON = require('merge-json');
const client = dgram.createSocket('udp4');
const fs = require('fs').promises;
const fs1= require('fs');


fs.writeFile('./ledger3.txt','start\n');
var before_id = 0; //이전 아이디값을 저장하기 위한 변수 
//var array = 0;
var rejoin_start = 0;
//var array_cnt = 0;
var dead_array = 0; //죽은 장부
var r_array = 0; //죽은 장부를 리턴
var js_array =0; //제이슨으로 변환한 죽은 장부의 리턴 
var msg_array = 0;
var flag = 0;
var  ledger = 'start \n';
var counter = 0;
var before_logindex =0; //이전값의 인덱스
var before = 0; //이전 cnt값과 비교하기 위한 변수 // 트랜잭션에서 오는 카운트값과 이전 값을 비교하기위한 변수 

var before_cnt = 0; // 트랜잭션에서 오는 카운트값과 이전 값을 비교하기위한 변수
var commit_cnt = {"commit_cnt":0}; //commit을 하기위한 ok메시지의 카운팅을 하기위한 변수 커밋을 보낼때 쓸 카운트 ->2가되면 커밋 메시지 보내 ㅁ
var checkcommit_msg = {}; //커밋된 메시지와 자신이 마지막으로 받은 커밋메시지를 비교하기 위한 변수

var check_cmledger_array = 0; //커밋렛져의 배열 ㄴ
var ar_length = 0; //배열의 길이 
//favorite을 위한 변수

var fav1 = 0;
var fav2 = 0;


//var random1 = Random.getRandom(100,900);//랜덤 시간후 전송하기 위한 변수
var random1 = 120.23640979919921;

var before_state = 'leader';


const _sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

var orderer3 = '{"id":"orderer3","state":"leader","term":1} '; //JSON형식으로 데이터 저장 

var orderer_parse = JSON.parse(orderer3);

var copy ='';
client.bind({
    address:'localhost',
    port : 9003
  })

  
  const check=(value,state,array,rejoin,wait)=>{
    if(value%1000==0  && state=='leader'){
      console.log(value,'dead!!!!\n\n\n\n\n\n\n\n')
      orderer_parse.state = 'follower'; // 오더러를 죽이고
      orderer_parse.term -=10;
      if(array==0){
        dead_array = fs1.readFileSync('ledger3.txt').toString().split("\n");
        var l = dead_array.length;
        console.log('deadledger=',dead_array[l-2]);
        r_array = dead_array[l-2];
        
        console.log('dead_array\n\n\n\n\n\n\n',dead_array);
        console.log('r_array\n\n\n\n\n\n\n',dead_array)
        js_array = JSON.parse(r_array);
        dead_array = 0;
      }
    }
  }

const check_cmledger = (rejoin,state,array)=>{
  if(rejoin == 'yes' && state == 'leader',array == 0){
    check_cmledger_array=fs1.readFileSync('cmledger.txt').toString().split("\n");
    ar_length = check_cmledger_array.length;
    

  }
}
const interval = setInterval(() => {
  console.log('0checkcommit_msg',checkcommit_msg);
  var heartbit = {heartbit:"heartbit"};

  var orderer_check_candidate1 = mergeJSON.merge(orderer_parse,checkcommit_msg);
  var orderer_check_candidate = mergeJSON.merge(orderer_check_candidate1,heartbit);
  console.log('random',random1);//랜덤값을 알기위해 체크 
  
  var orderer_str = JSON.stringify(orderer_check_candidate);
 console.log('orderer_str',orderer_str);
  console.log('orderer_parse',orderer_parse);
  console.log('msg_array\n\n',msg_array);
  //여기다가 commit_msg 추가 해서 mh에서 저장해놓은 commit_msg와 같으면  candidate가 될수있도록 구현하면 될듯 
  
  client.send(orderer_str, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to term' + HOST +':'+ PORT);
    console.log(orderer_str);
  //  client.close();

  
  });


}, random1);///1초~~2초 사이의 랜덤값으로 전송


client.on("listening", function () {
  var address = client.address();
  console.log("orderer3 listening " +
      address.address + ":" + address.port);
});

  
var before_cnt = 0;
client.on('message', (msg, rinfo) => {
  console.log(`orderer3 got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  
  var i = JSON.parse(msg);
  if(i.id == 'app'&&i.value%10==9){
    before_state_check_leader = orderer_parse.state;
  }  
  if(i.id == 'app'&&i.value%10==0 &&orderer_parse.state == 'leader'&&before_state_check_leader == 'leader'){
    orderer_parse.state = 'follower'; // 오더러를 죽이고
    //beofre_state = 'leader'
    orderer_parse.term -=10;

  }  

  // if(orderer_parse.state == 'leader' &&i.rejoin == 'yes'){
  //   orderer_parse.rejoin = 'yes';//오더러의 rejoin이 yes면 하던일을 멈추고 장불르 복사해주어야함 
  //   check_cmledger(i.rejoin,orderer_parse.state,check_cmledger_array);
  //   console.log('check_cmledger_array',check_cmledger_array,'length=',length);

  // }
  
  if(orderer_parse.rejoin == 'yes'){
    console.log(check_cmledger_array);
    console.log(ar_length);
    
  }
  if(orderer_parse.state=='rejoin' && i.rejoincopy=='send'){ //오더러의 상태가 rejoin이고 카피 메시지를 리더가 보냈으면
    var copy_ledger = `{"id":"${i.id}","key":"${i.key}","value":${i.value},"logindex":${i.logindex},"term":${orderer_parse.term}}\n`

    if(before_logindex!=i.logindex &&js_array.logindex!=i.logindex){
      before_logindex=i.logindex;
        
    fs.appendFile('./ledger3.txt',copy_ledger)
        .then(()=>{
            return fs.readFile('./ledger3.txt');
        })
        .then ((data)=>{ //동기로 사용하기 위해 ()함수 앞에 async를 붙ㅌ여주고
            console.log('ledger3:',data.toString());
            var copy_ok = `{"id":"${i.id}","key":"${i.key}","value":${i.value},"logindex":${i.logindex},"term":${orderer_parse.term},
            "copy":"ok","leaderport":${i.leaderport}}`;
            client.send(copy_ok,i.leaderport,HOST,()=>{ //카피를 했다고 ok메시지를 보내줌 
              console.log('send copy_ok',copy_ok);
            })
   
        })
        .catch((error)=>{
            console.error(error);
        });
   

      

  }
    if(js_array.logindex==i.logindex &&orderer_parse.state =='rejoin'){ //장부복사가 끝낫다고 보내야함 
      var copy_finish = `{"id":"${i.id}","key":"${i.key}","value":${i.value},"logindex":${i.logindex},"term":${orderer_parse.term},
      "copy":"finish","leaderport":${i.leaderport},"finish":"finish"}`;
      var finish = JSON.parse(copy_finish);
      console.log('finish',finish);
      client.send(copy_finish,PORT,HOST,()=>{ //카피를 했다고 ok메시지를 보내줌 
        dead_array = 0; //dead _array 를 0으로 만들어줌 => 이래야 다시 죽고나면 분기가 걸리니까 
        console.log('send copy_finish',copy_finish);
        orderer_parse.state ='follower';
        orderer_parse.rejoin = 'finish'
      })
      
    }
  }
  /*if(i.rejoin_state == 'rejoin'){
    orderer_parse.wait = 'yes'; //rejoin 인 노드가 있으면 하던일을 멈추고 리조인이 끝날때 까지 기다려야함 
  }
  if(i.finish == 'finish'){
    orderer_parse.wait = 'no'; //rejoin이 끝나면 wait을 no로 바꿔줌 
  }*/

  if(orderer_parse.state == 'leader' &&(i.state == 'rejoin' ||i.rejoin_state == 'rejoin')){
    check_cmledger(i.rejoin,orderer_parse.state,check_cmledger_array);
    msg_array=i;
    console.log('msg_array',msg_array);
    rejoin_start = i.rejoinstart;
    orderer_parse.rejoin = 'yes';//오더러의 rejoin이 yes면 하던일을 멈추고 장불르 복사해주어야함
    
    }
  if(orderer_parse.rejoin == 'yes' &&i.copy!='ok' &&i.copy !='finish'){ 
    console.log(check_cmledger_array);
    console.log(ar_length);
    console.log('check_cmledger_array[ar_length-1',check_cmledger_array[ar_length-2]);
    var st=check_cmledger_array[ar_length-2];
    var cm_array = JSON.parse(st);

    var cm_array_str=`{"id":"${cm_array.id}","key":"${cm_array.key}","value":${cm_array.value},"logindex":${cm_array.logindex},"rejoinport":${msg_array.port},
    "leaderport":9003,"rejoincopy":"send"}`;

    client.send(cm_array_str,PORT,HOST,()=>{
      console.log('send last commit',cm_array_str);

    });
    
    
  }
  if(orderer_parse.state=='leader'&&i.copy == 'ok' &&i.finish != 'finish' && orderer_parse.rejoin =='yes'){
    ar_length-=1;
    var jt=check_cmledger_array[ar_length-2];
    var cm_array1 = JSON.parse(jt);
    if(cm_array1.logindex>msg_array.logindex){
      var cm_array1_str=`{"id":"${cm_array1.id}","key":"${cm_array1.key}","value":${cm_array1.value},"logindex":${cm_array1.logindex},"rejoinport":${msg_array.port},
      "leaderport":9003,"rejoincopy":"send"}`;

      client.send(cm_array1_str,PORT,HOST,()=>{
        console.log('send next commit',cm_array1_str);

    });
  }
  }
  if(orderer_parse.state=='leader'&&i.finish == 'finish' && orderer_parse.rejoin =='yes'){
    console.log('finish',i);
    console.log(orderer_parse.rejoin);
    orderer_parse.rejoin = 'no';
    //dead_array = 0; 
    check_cmledger_array = 0;
    var end = Date.now()-rejoin_start;
    var endtime = `end time is ${end}`;
    fs.appendFile('./rejoin.txt',endtime)
      .then(()=>{
        return fs.readFile('./rejoin.txt')
      
      })
      .then((data)=>{
        console.log('rejoin_end:',data.toString());

      })
      .catch((error)=>{
        console.error(error);
      });
      
    console.log(end);
   
    console.log('change',orderer_parse.rejoin);
  }

  

  if (i.id==='app'&& orderer_parse.rejoin !='yes' &&i.finish !='finish'){ 
    

    if(before_cnt != i.cnt){  //이전 카운트와 현재 들어온 메시지의 카운트가 다를경우만 장부에 저장
      // 일정시간 커밋이 오지않으면 이전값을 계속해서 보내니까 중복된값을 저장하지 않기위해 위와같이 비교 후 저장 
      if(orderer_parse.state =='dead'){ //애플리케이션의 값을 5개 받으면 
        counter+=1
        if (counter == 5){
          orderer_parse.state = 'rejoin' // rejoin상태로 변환 
          var start =Date.now();
          var r_array_str=`{"app_id":"${js_array.id}","key":"${js_array.key}","value":${js_array.value},"logindex":${js_array.logindex},"orderer_id":"${orderer_parse.id}"
        ,"rejoin_state":"${orderer_parse.state}","port":9003,"rejoinstart":${start}}`;

          client.send(r_array_str,PORT,HOST,()=>{ //rejoin하는 오더러 장부의 마지막 부분을 리더에게 전송
            console.log('send last commit r_array',r_array_str);
          })
        }
      }


        console.log('it is transaction',i);
        //orderer_parse.value = i.value;
        if(orderer_parse.state !='dead' &&orderer_parse.state!='rejoin'){
        ledger = `{"id":"${i.id}","key":"${i.key}","value":${i.value},"logindex":${i.cnt}}\n`
        before_cnt = i.cnt 
    
        fs.appendFile('./ledger3.txt',ledger)
        .then(()=>{
            return fs.readFile('./ledger3.txt');
        })
        .then (async (data)=>{ //동기로 사용하기 위해 ()함수 앞에 async를 붙ㅌ여주고
            console.log('ledger3:',data.toString());
            if (dead_array == 0 && i.rejoin !='yes'){
              await check(i.value,orderer_parse.state,dead_array,orderer_parse.rejoin,orderer_parse.wait); //await를 check 함수 앞에 붙여줌 //이렇게하지않으면 파일에 트랜잭션을 저장하기전 장부를 읽어옴;;
              
            }
       
   
        })
        .catch((error)=>{
            console.error(error);
        });
   

      }
        
    }
    //여기까지가 리조인 
    if (orderer_parse.state == 'leader' && orderer_parse.rejoin !='yes' &&i.finish !='finish'){
      
      
      var leader = {"msg":"copy","id":"orderer3","state":"leader","term":orderer_parse.term,"port":9003 } ;//leader면 카피 메시지를 전송하기 위해 json형식으로 선언//간소화 가능할듯
      //orderer1.xx = xx이런식으로 
      var copymsg = mergeJSON.merge(i,leader);//트랜잭션과 합쳐서 전송
      console.log('copymsg',copymsg);

      var str_copymsg =  JSON.stringify(copymsg);//string형식으로 전송 
      //const interval1 = setInterval(() => {
      client.send(str_copymsg, PORT, HOST, function(err, bytes){
        if (err) throw err;
        console.log('copy this',str_copymsg);
        });
     // }, Random.getRandomInt(1000,2000));
    }
    if (orderer_parse.state == 'candidate'){
      
      
      var leader = {"msg":"copy","id":"orderer3","state":"candiate","term":orderer_parse.term,"port":9003 } ;//leader면 카피 메시지를 전송하기 위해 json형식으로 선언//간소화 가능할듯
      //orderer1.xx = xx이런식으로 
      var copymsg = mergeJSON.merge(i,leader);//트랜잭션과 합쳐서 전송
      console.log('copymsg',copymsg);

      var str_copymsg =  JSON.stringify(copymsg);//string형식으로 전송 
      //const interval1 = setInterval(() => {
      client.send(str_copymsg, PORT, HOST, function(err, bytes){
        if (err) throw err;
        console.log('copy this',str_copymsg);
        });
     // }, Random.getRandomInt(1000,2000));
    }
  }
  
    if(i.msg =='copy'&&orderer_parse.state!='leader' && orderer_parse.state != 'candidate' )//카피 메시지가 오고 
    {
    //ledger+=`key = ${i.key} value = ${i.value} \n`
    //console.log('ledger = ',ledger);
      var ok = {"orderer_state":"ok","orderer_id":"3"};
      ok.time = Date.now();
      var okmsg = mergeJSON.merge(i,ok);
      delete okmsg.msg;
      var str_okmsg = JSON.stringify(okmsg);
    
      client.send(str_okmsg, PORT, HOST, function(err,bytes){
        console.log('send ok',str_okmsg); 
        
      });
   }
    if(orderer_parse.state == 'leader' && i.orderer_state =='ok'&& i.orderer_id != before_id  && orderer_parse.rejoin !='yes'){//ok메시지가 오고 orderer가 leader 면
        console.log(before_id);
        
        before_id = i.orderer_id;
        console.log(i.orderer_id);
        //처음 ok를 보내준 애를 저장하고
        //그다음 ok를 보내준애를 저장해야함

        console.log('ok = ',i);
     // var cmtime = i.start -Date.now();
     // console.log('cmtime :',cmtime);

      //var commitmsg = mergeJSON.merge(i,commit_cnt);
      //before와 현재 들어온 값의 카운트가 같으면 comit_cnt+1 -> commit+cnt == 3 이면 commit 메시지 send 
      if (before == i.cnt){ // before = 0을 초기값으로 갖는 이전값과 commitmsg.cnt를 비교 해서 같으면
        commit_cnt.commit_cnt +=1// commitmsg.commit_cnt = 0 에다가 1을 더해줌 
        if(commit_cnt.commit_cnt == 1){
          fav1 = i.orderer_id;//fav1 에 처음으로 보낸 id저장
          }
        var commitmsg = mergeJSON.merge(i,commit_cnt); // i와 commit_cnt를 합침
     
        console.log('commitmsg.commit_cnt',commitmsg.commit_cnt);
        //before = commitmsg.cnt; 
      
        if(commitmsg.commit_cnt ==2 ){
          fav2 = i.orderer_id; //fav2에 두번째로 보낸 id 저장 
          var commit ={};
          commit.state = 'leader'
          commit.commit = 'commit';
          commit.key = i.key;
          commit.value = i.value;
          commit.cnt = i.cnt;
          commit.port = '9003';
          commit.start = i.start;
          commit.term  = orderer_parse.term;
          commit.fav1 = fav1;
          commit.fav2 = fav2;
          commit.try = i.try;

        
          var commitmsg = JSON.stringify(commit);
        
          client.send(commitmsg, PORT, HOST, function(err,bytes){
            console.log("send commit",commitmsg);
            commit_cnt.commit_cnt = 0; //커밋을 보냇으니까 다시 0으로 만든후 다음 cnt와 비교 
            before +=1; // 메시지를 보낸뒤에는 1씩 증가시킨뒤 비교후 다시 commitmsg전송
           

          });

        }
      }
   }
   if(orderer_parse.state == 'candidate' && i.orderer_state =='ok'&& i.orderer_id != before_id &&orderer_parse.wait != 'yes'){//ok메시지가 오고 orderer가 candidate 면
    console.log(before_id);
    
    before_id = i.orderer_id;
    console.log(i.orderer_id);
    console.log('ok = ',i);
    before = i.cnt; //  leader가 죽고나면 i.cnt는 계속해서 동일한 값을 보내줄거니까 before에 저장해놓고 ok메시지가 i.cnt 번째에 대해 오는지 비교후 2개이상 오면 commit을 보냄 
    console.log('before cnt',before);
    console.log('i.cnt= ',i.cnt);
 // var cmtime = i.start -Date.now();
 // console.log('cmtime :',cmtime);


  //var commitmsg = mergeJSON.merge(i,commit_cnt);
  //before와 현재 들어온 값의 카운트가 같으면 comit_cnt+1 -> commit+cnt == 3 이면 commit 메시지 send 
  if (before == i.cnt){ // before = 0을 초기값으로 갖는 이전값과 commitmsg.cnt를 비교 해서 같으면
    commit_cnt.commit_cnt +=1// commitmsg.commit_cnt = 0 에다가 1을 더해줌 
  
    var commitmsg = mergeJSON.merge(i,commit_cnt); // i와 commit_cnt를 합침
 
    console.log('commitmsg.commit_cnt',commitmsg.commit_cnt);
    //before = commitmsg.cnt; 
  
    if(commitmsg.commit_cnt ==2 ){
      console.log('leaderchange');
      orderer_parse.state = 'leader';
      orderer_parse.rejoin = 'dead';
      commit_cnt.commit_cnt = 0;
      //before+=1;
      var commit_ledger = `key = ${checkcommit_msg.key} value = ${checkcommit_msg.value} cnt = ${checkcommit_msg.cnt}\n`
        
      fs.copyFile('cmledger.txt','ledger3.txt')//cmledger의 장부를 먼저 복사해 오고 ledger의 값을 장부에 추가 왜냐하면 
      //ledger에는 interval하게 app에서 계속해서 값을 보내고 있음-> ledger의 값을 여기서 저장하지 않고 넘어가면 cmledger에는 리더가 죽은뒤에 새로 뽑힌 리더가 처음으로 보낸
      //commit메시지가 저장되지않기 때문에 이렇게 해서 저장해야됨!
      .then(()=>{
          console.log('cmledger 복사완료');
          fs.readFile('./ledger3.txt')
              .then((data)=>{
                  console.log(data.toString());
                    fs.appendFile('./ledger3.txt',ledger)
                      .then(()=>{
                        return fs.readFile('./ledger3.txt');
                        })
                        .then((data)=>{
                           console.log('ledger3:',data.toString());
   
                         })
                       .catch((error)=>{
                            console.error(error);
                         });
                       })
              .catch((error)=>{
                  console.error(error);
             });
           })
      .catch((error)=>{
        console.error(error);
    });
    }
  }
}
   if((i.candidate =='orderer1'||i.candidate =='orderer2'||i.candidate =='orderer5'||i.candidate =='orderer4')
   && orderer_parse.rejoin !='yes'&&orderer_parse.state != 'dead' &&orderer_parse.state !='rejoin'&&orderer_parse.state != 'favorite'){
    before_state = orderer_parse.state;
    if(before_state == 'follower'){
      orderer_parse.state =  'follower';
    }
    if(before_state == 'candidate'){
      orderer_parse.state = 'favorite';
    }
    if(before_state == 'leader'){
      orderer_parse.state = 'favorite'
    }
    console.log('change follwer',orderer_parse);
   }
   if(i.candidate == 'orderer3'&& orderer_parse.state!='leader'&& orderer_parse.rejoin !='yes'&&orderer_parse.state !='rejoin'&&orderer_parse.state != 'dead'){
     orderer_parse.state = 'candidate';
     console.log('change candidate',orderer_parse);

   }
    if(orderer_parse.state == 'leader' && i.commit == 'commit'  && orderer_parse.rejoin !='yes')
    { 
     
      orderer_parse.term += 1;
      console.log('this is commit');
      fs.copyFile('ledger3.txt','cmledger.txt')
              .then(()=>{
                  console.log('복사완료');
                  fs.readFile('./cmledger.txt')
                    .then((data)=>{
                      console.log(data.toString());
                    })
                    .catch((error)=>{
                        console.error(error);
                    });
                  })
              .catch((error)=>{
                console.error(error);
            });
      
          }
    if(orderer_parse.state != 'leader' && i.commit == 'commit')
    {
      if((i.fav1 =='3' || i.fav2 == '3')&&orderer_parse.state != 'candidate'){ 
        //fav1 or fav2 가 해당 오더러이면 favorite으로 상태 변경+ 현재 상태가 candidate 도아니고 dead  도아니고 rejoin 도 아닌경우 = follower인경우
        orderer_parse.state = 'favorite';
        console.log('state change favorite',orderer_parse);
      }
      if(i.fav1 !='3' && i.fav2 !='3'&&orderer_parse.state != 'rejoin'&&orderer_parse.state !='dead'&&orderer_parse.state != 'candidate'){
        //fav1 or fav2 가 해당 오더러가 아니면 follower로 상태 변경+ 현재 상태가 candidate 도아니고 dead  도아니고 rejoin 도 아닌경우 = favorite인경우
        orderer_parse.state = 'follower';
        console.log('state change favorite',orderer_parse);
      
      }
      orderer_parse.term = i.term
      console.log('this is commit');
      fs.copyFile('cmledger.txt','ledger3.txt')
              .then(()=>{
                  console.log('cmledger 복사완료');
                  //checkcommit_msg = i.commit;
                  fs.readFile('./ledger3.txt')
                      .then((data)=>{
                          console.log(data.toString());
                          checkcommit_msg.key = i .key;
                          checkcommit_msg.value = i.value;
                          checkcommit_msg.cnt = i.cnt;
                      })
                      .catch((error)=>{
                          console.error(error);
                     });
                   })
              .catch((error)=>{
                console.error(error);
            });
          }
    if(i.leader == 'noleader'){
        const timer = async () => {
          try{
    
            //var time = Random.getRandom(500,1500);
            await _sleep(random1); //1~2초 사이의 랜덤값이 지난후 전송하도록
            orderer_parse.term+=1;
        }

            catch (error){  
                console.error(error);
            } 
            
        };
        timer();
    
        
    }
  });
    