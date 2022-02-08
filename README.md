#Raft
-------------------------------


인천대학교 컴퓨터공학부 분산시스템 연구실 raft 알고리즘
orderer의 개수는 5개

testmh = message handler

app = transaction을 발생시킴

noRejoin_orderer는 기존의 raft 알고리즘이고 

noRejoin_forderer는 favorite이 추가된 raft 알고리즘

각각의 폴더명 뒤의 숫자는 time min을 나타냄

사용법
ordere가 5개이고 message handler와 transaction을 발생시키기 위한 프로그램을 실행하기 위해
터미널을 7개 열어줌

기존의 raft 알고리즘을 테스트하는 경우

5개의 터미널에 각각 node noRejoin_orderer(time min)~(time max).(orderer number) 실행시킨 뒤
node app1.1과 node testmh3.0을 실행시킴

----------------------------------------------------------------------------------------

favorite이 추가된 raft 알고리즘을 테스트하는 경우

5개의 터미널에 각각 node noRejoin_forderer(time min)~(time max).(orderer number) 실행시킨 뒤
node app2.1과 node testmh4.0을 실행시킴
