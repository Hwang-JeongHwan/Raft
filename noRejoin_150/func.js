
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
} //최대값 최소값사이의 랜더값 출력 

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
  }

 

console.log(getRandomInt(1,10));
module.exports = {
    getRandom,
    getRandomInt,
    //check
};