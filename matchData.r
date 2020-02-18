library(recommenderlab)
library(tidyverse)
library(stringr)
library(arules)
library(data.table)
library(dplyr)
library(MASS)
library(fBasics)
library(RColorBrewer)
library(wordcloud)
library(nnet)
setwd("C:/Users/KTH/Desktop/github/example")
matchInfo <- read.csv("matchInfo.csv")
matchData <- read.csv("matchData.csv")

winInfo <- matchInfo[matchInfo$Match == "win",] #승리한 매치만 보관
loseInfo <- matchInfo[matchInfo$Match == "lose",] #패배한 매치만 보관

Tank<- matchInfo[matchInfo$Position == "탱커",] 
Support <-matchInfo[matchInfo$Position == "서포터",] 
Melee <- matchInfo[matchInfo$Position == "근거리딜러",] 
Ranged <- matchInfo[matchInfo$Position == "원거리딜러",] 
matchData<-matchData[matchData$Matach =="win",]
MapCount <- matchData%>%group_by(Map.Name)%>%summarise(pick=n())
matchCount <-matchInfo%>%group_by(Match.ID)%>%summarise(pick=n())

nrow(matchCount)#판수
MapCount$rate <- (MapCount$pick)/nrow(matchData)
view(MapCount) # 맵 등장빈도

######맵 별 승률계산#########
MapCount[[1]][1] #앞자리 1= 지역명 2= 등장수 뒷자리 =맵이름 (1~5)
mapInfo <- matchInfo[matchInfo$Map == MapCount[[1]][1],]
pickRate <- mapInfo%>%group_by(Character.Id)%>%summarise(pick=n(),meanKill=mean(Kill),meanDeath=mean(Death),meanAssist=mean(Assist))
winRate <- mapInfo[mapInfo$Match =="win",]%>%group_by(Character.Id)%>%summarise(win=n())
CharRate <- merge(pickRate,winRate,by='Character.Id')
CharRate$pickRate = CharRate$pick/MapCount[[2]][1]
CharRate$winRate = CharRate$win/CharRate$pick
CharRate$meanKDA = (CharRate$meanKill+CharRate$meanAssist)/CharRate$meanAssist
CharRate<-CharRate[order(-CharRate$pick),]
CharRate<-CharRate[CharRate$pickRate>0.1,]
viewRate <- cbind(CharRate[1],CharRate[7:9])
view(CharRate)
##########################


########승률계산##########
pickRate <- matchInfo%>%group_by(Character.Id)%>%summarise(pick=n(),meanKill=mean(Kill),meanDeath=mean(Death),meanAssist=mean(Assist))
winRate <- matchInfo[matchInfo$Match =="win",]%>%group_by(Character.Id)%>%summarise(win=n())
CharRate <- merge(pickRate,winRate,by='Character.Id')
CharRate$pickRate = CharRate$pick/nrow(matchCount)
CharRate$winRate = CharRate$win/CharRate$pick
CharRate$meanKDA = (CharRate$meanKill+CharRate$meanAssist)/CharRate$meanAssist
CharRate <- CharRate[,c(1,2,6,7,8,3,4,5,9)]
CharRate<-CharRate[order(-CharRate$pick),]
setwd("C:/Users/KTH/Desktop/github/example/position")
write.csv(CharRate,"Total.csv",row.names =FALSE)
view(CharRate)
##########################

########포지션별 승률계산##########
calPosition<- function(N){
  pickRate <- N%>%group_by(Character.Id)%>%summarise(pick=n(),meanKill=mean(Kill),meanDeath=mean(Death),meanAssist=mean(Assist))
  winRate <- N[N$Match =="win",]%>%group_by(Character.Id)%>%summarise(win=n())
  CharRate <- merge(pickRate,winRate,by='Character.Id')
  CharRate$pickRate = (CharRate$pick/nrow(matchCount))
  CharRate$winRate = (CharRate$win/CharRate$pick)
# CharRate <- CharRate[CharRate$pickRate >=0.1,]
  CharRate$meanKDA = (CharRate$meanKill+CharRate$meanAssist)/CharRate$meanAssist
  CharRate <- CharRate[order(-CharRate$pick),]
  CharRate <- CharRate[,c(1,2,6,7,8,3,4,5,9)]
  setwd("C:/Users/KTH/Desktop/github/example/position")
  Save <- paste0(N$Position[1],".csv")
  write.csv(CharRate,Save,row.names =FALSE)
}
calPosition(Tank)
calPosition(Support)
calPosition(Melee)
calPosition(Ranged)
##########################

#######승리조합##########
setwd("C:/Users/KTH/Desktop/github/example")
winCombi<-(table(cbind(winInfo[4],winInfo[17])))
write.csv(winCombi,"winCombi.csv")
winCombi <- read.csv("winCombi.csv",check.names=FALSE,sep = ",")
winCombi <- (data.frame(table(winCombi[-1])))
names(winCombi)[5] <-c("winGame")
#######패배조합##########
loseCombi<-(table(cbind(loseInfo[4],loseInfo[17])))
write.csv(loseCombi,"loseCombi.csv")
loseCombi <- read.csv("loseCombi.csv",check.names=FALSE,sep = ",")
loseCombi <- (data.frame(table(loseCombi[-1])))
names(loseCombi)[5] <-c("loseGame")
#######조합총합##########
combination <- (merge(winCombi,loseCombi,all=T))
combination <- data.frame(combination)
combination$total <- (combination$winGame+combination$loseGame)
combination <- combination[combination$total>10,]
combination$ratio <- (combination$winGame+combination$loseGame)/(nrow(matchCount)*2)
combination$winratio <- (combination$winGame)/(nrow(matchCount))
combination <-combination[order(-combination$total),]
write.csv(combination,"combination.csv",row.names =FALSE)
#########################




##########템트리 찾기(이긴 경기 기준)###########
setwd("C:/Users/KTH/Desktop/github/build")
for (i in nrow(CharRate)){
  
  
  
}

colnames(list)
list<-matchInfo[matchInfo$Character.Id ==CharRate[[1]][i],]
list<-list[7:36] 
colnames(list)
position <- table(list[11])
position <- data.frame(position)
position <- position[position$Freq>0,]
view(position[order(-position$Freq),])

attribute<-table(list[11:14])#특성123
attribute <- data.frame(attribute)
attribute <- attribute[attribute$Freq>5,]
attribute <- attribute[order(-attribute$Freq),]
view(attribute)

for (j in 15:30){ #장비
  position <- table(list[20])
  position <- data.frame(position)
  position <- position[position$Freq>0,]
  view(position[order(-position$Freq),])
}
  
############################################




#########듀오찾기(짜는중)############
colnames(winInfo)
corlist <- cbind(winInfo[3],winInfo[6])
corlist<-table(corlist)
write.csv(corlist,"UserTable.csv")
corlist <- read.csv("UserTable.csv",check.names=FALSE,sep = ",")
corlist <- cor(corlist[-1],method = "pearson") 
write.csv(corlist,"corlist.csv")
##########################



