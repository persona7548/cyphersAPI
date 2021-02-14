# cyphersAPI
www.oxhorn.info

## Oxhorn.info

Neople OpenApi(https://developers.neople.co.kr/) 이용, 경기 데이터를 수집하여 통계정보 제공, 전적검색 제공
 

## 사용방법

1.code/cypherCrawl.py 실행 (line 4 api_key 삽입, line 11 파일 위치 조정 필요)  
  -> 1~10000위 유저의 IDcode,Name,rating 추출

2.code/findMatchID.py 실행 (line 6 api_key 삽입, line 7 & 31 파일 위치 조정 필요) 
  -> 1~10000위 유저가 진행한 matchID 추출

3.code/matchData.py 실행 (line 6 api_key 삽입, line 7 & 31 파일 위치 조정 필요) 
  -> 1~10000위 유저가 진행한 match의 상세정보 추출

4.(R 사용시에만) code 폴더의 matchData.r을 이용하여 3의 결과물을 핸들링





