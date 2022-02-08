const Random = require('./func');


const PORT = 8000;
const HOST = '127.0.0.1';
const dgram = require('dgram');
const mergeJSON = require('merge-json');
const fs = require('fs').promises;
const client = dgram.createSocket('udp4');

var count = 0;
var total = 0;
var total2 = 0;
var count2 = 0;
var total_time = 0;
var total_time2 = 0;
var before_port = '9003';

//var random = Random.getRandom(1000,2000);
var random1 = 1462.1086229919283;

//var randomI = Random.getRandom(500,1500);
var randomI1 = 845.4471561466069;


client.bind({
    address : 'localhost',
    port:8001
});
//app.value=a.value.replace(2);

//var first = '{"first":"first"}'

var json = '{"id":"app","key":"x","value":1,"cnt":0,"start":0,"try":0}'//JSON형식으로 선언
var app = JSON.parse(json); //string을 JSON으로 변환 key값에 따라 value를 바꾸기 위해 
var retry = {"retry":"retry"};
var first = '{"first":"first"}'

/*client.send(first,PORT,HOST,(err,bytes)=>{
    console.log('send start',first);
});*/
client.on("listening", function () {
    var address = client.address();
    console.log("app listening " +
        address.address + ":" + address.port);
  });

const _sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const timeout =  setTimeout(()=>{},2000);



client.on('message',(msg,rinfo)=>{
    console.log(`app got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    var i = JSON.parse(msg);
   
  //UDP에서 send를 하기 위해서는 string or array형식이어야 하기때문에 
    //console.log(x);
    const timer = async () => {
        try{

            //var random1 = Random.getRandom(500,1500);
            await _sleep(randomI1); //1~2초 사이의 랜덤값이 지난후 전송하도록
            //console.log('start time',time);
          
            
             //console.log(app.start);
//            var got_time = i.start - Date.now();
  //          console.log('got_time',got_time);

           /* if(i.first == 'first'){
                var w = JSON.stringify(app);
                client.send(w,PORT, HOST, (err,bytes)=>{
                    if (err) throw err;
                    console.log('UDP message sent to ' + HOST +':'+ PORT);
                    console.log(w);
                })
            }*/
            //while(true){
            if (i.commit != 'commit' && i.interval == 'interval'){
                await _sleep(randomI1); //1~2초 사이의 랜덤값이 지난후 전송하도록
            
                //await _sleep(5000);
                //mergeJSON.merge
/*                var cmtime = i.start - Date.now();
                if (cmtime>2000){
                    console.log('time over');
                }
                var retry_merge = mergeJSON.merge(app,retry);

                var y = JSON.stringify(retry_merge);//JSON을 string형식으로 변환
*/              app.try +=1;
                var j = JSON.stringify(app)
                client.send(j, PORT, HOST,(err, bytes) => {
                    if (err) throw err;
                    console.log('UDP message sent to ' + HOST +':'+ PORT);
                    console.log(j);
                });
        
                
          //console.log(i);
     
            //client.close();
                //count+=1;
                //console.log(count);
            //var start = Date.now();
            }
    
            if (i.commit == 'commit'){
                app.try=0;
                app.cnt+=1;
                app.value+=1; // 1,10사이의 랜덤값으로 app.value값 설정
                delete i.retry;
                app.start = Date.now() ;
                var x = JSON.stringify(app);//JSON을 string형식으로 변환
                //시간 측정을 여기로 옮기고 여기서부터 측정해야할듯 
                client.send(x, PORT, HOST,(err, bytes) => {
                    if (err) throw err;
                    console.log('UDP message sent to ' + HOST +':'+ PORT);
                    console.log(x);
            //  console.log(i);
         
                //client.close();
                    //count+=1;
                    //console.log(count);
                //var start = Date.now();
                });
        
            //커밋됏다고 오면 다시보내고
            //커밋됏다고 메시지가 안오면 현재 메시지를 재전송
            //커밋이 오면 다음 메시지를 다시보냄
    
        }
    //}
    
    }
        catch (error){
            console.error(error);
        } 
        
    };
    timer();
    
    
    
    if (i.commit == 'commit'){
        var end = Date.now()-i.start;
        var endtime = `response time is ${end} try = ${i.try+1} leader alive \n`;
        var endtime2 = `${end}\n`;
        
     
        console.log('time:',end);
        if (end<1000){
            total+=end;
            count +=1;
        
    }
        
        total_time = total/count;
        if(i.value <= 1001 && end<100000){
            if(before_port != i.port){
                var endtime = `response time is ${end} try = ${i.try+1} abnormal \n`;
            }
            if(i.value % 10 == 0 ){
                var endtime=`response time is ${end} try = ${i.try} leader dead \n`;
    
            }
            total2+=end;
            count2+=1;
            total_time2 = total2/count2;
            console.log('total2:',total_time2);
            // if (count2 == 100){
            //     var total3 = `transaction is 100 total time is ${total_time2}`;
            //     fs.appendFile('./change.txt',total3)
            //     .then(()=>{
            //     return fs.readFile('./change.txt')
            
            //     })
            //     .then((data)=>{
            //  //   console.log('change:',data.toString());
      
            //  })
            //     .catch((error)=>{
            //     console.error(error);
            //     });
     
            // }
        
            fs.appendFile('./change.txt',endtime)
            .then(()=>{
              return fs.readFile('./change.txt')
            
            })
            .then((data)=>{
            //  console.log('change:',data.toString());
      
            })
            .catch((error)=>{
              console.error(error);
            });
            fs.appendFile('./change1.1.txt',endtime2)
            .then(()=>{
              return fs.readFile('./change1.1.txt')
            
            })
            .then((data)=>{
            //  console.log('change:',data.toString());
      
            })
            .catch((error)=>{
              console.error(error);
            });
            before_port = i.port;
        
        }
        //console.log(`app got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        if (end<1000){
            total+=end;
            count +=1;
        
    }
        total_time = total/count;
        
        console.log('total = ',total_time);
        //  console.log(i);
     
            //client.close();
                //count+=1;
                //console.log(count);
            //var start = Date.now();
        
        //커밋됏다고 오면 다시보내고
        //커밋됏다고 메시지가 안오면 현재 메시지를 재전송
        //커밋이 오면 다음 메시지를 다시보냄

    }
   
  
  

});

const interval = setInterval(() => { // timeout 을 설정하기위해 -> udp모듈중 timeout을 설정하는 모듈도 없을 뿐더러 3일간 구현해보려  했지만 실패하여 2~3초마다 메시지를 보내는 함수 구현
    //이렇게해서 message handler로 메시지를 보내고 mh에서 다시 어플리케이션으로 메시지를 보내는 형식임
    //메시지를 받고 그 메시지가 커밋이면 다음 메시지를 보내고 커밋이 오지않으면 이전 메시지를 보내야함
    // on메소드는 메시지를 받아야 실행되기때문에 이런식으로 구현 일정주기마다 메시지를 보내고 commit이면 다음 메시지를 보내고 commit이 아니면 이전메시지를 보냄 
    
    var itv = '{"interval":"interval"}';
    console.log('random',random1);
    console.log('randomI',randomI1);

    client.send(itv, PORT, HOST, (err,bytes)=>{
        console.log('send interval',itv);
    })
},random1);


/*
const interval = setInterval(() => {
 
    app.value=Random.getRandomInt(1,10); // 1,10사이의 랜덤값으로 app.value값 설정
    app.start = Date.now();
    var x = JSON.stringify(app);//JSON을 string형식으로 변환
    //UDP에서 send를 하기 위해서는 string or array형식이어야 하기때문에 
    //console.log(x);
    
    client.send(x, PORT, HOST, function sync(err, bytes) {
        if (err) throw err;
        console.log('UDP message sent to ' + HOST +':'+ PORT);
        console.log(x);
      //  console.log(i);
     
        //client.close();
            //count+=1;
            //console.log(count);
        var start = Date.now();
        });
    
    app.cnt+=1;
    
    }, Random.getRandom(1000,2000));///1초~~2초 사이의 랜덤값으로 전송
      if (i.commit == 'commit'){
        var end = Date.now()-i.start;
        console.log('time:',end);
        count +=1;

        total+=end;
        var total_time = total/count;
        
        console.log(total_time); 
        //커밋됏다고 오면 다시보내고
        //커밋됏다고 메시지가 안오면 현재 메시지를 재전송
        //커밋이 오면 다음 메시지를 다시보냄

    }
    */
  
  

