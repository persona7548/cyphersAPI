setRepositories()
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
matchInfo<- unique(matchInfo)
winInfo <- matchInfo[matchInfo$Match == "win",] #승리한 매치만 보관
loseInfo <- matchInfo[matchInfo$Match == "lose",] #패배한 매치만 보관
colnames(matchInfo)

########승률계산##########
pickRate <- matchInfo%>%group_by(Character.Id)%>%summarise(pick=n())
winRate <- matchInfo[matchInfo$Match =="win",]%>%group_by(Character.Id)%>%summarise(win=n())

CharRate <- merge(pickRate,winRate,by='Character.Id')
CharRate$winRate = CharRate$win/CharRate$pick
view(CharRate[order(-CharRate$pick),])
##########################


#########짝꿍찾기############
corlist <- winInfo[2:4]
corlist <- corlist[-2]
corlist<-table(corlist)
write.csv(corlist,"UserTable.csv")
corlist <- read.csv("UserTable.csv",check.names=FALSE,sep = ",")
corlist <- cor(corlist[-1],method = "pearson") 
write.csv(corlist,"corlist.csv")
##########################



##########템트리 찾기(이긴 경기 기준)###########
CharRate[[1]][1] #사이퍼 이름 리스트(뒤 숫자에 따라 바뀜)  
colnames(matchInfo)
list<-matchInfo[matchInfo$Character.Id ==CharRate[[1]][45],]
list<-list[5:24] 
colnames(list)
position <- table(list[1])
position <- data.frame(position)
position <- position[position$Freq>0,]
view(position[order(-position$Freq),])

attribute<-table(list[2:4])#특성123
attribute <- data.frame(attribute)
attribute <- attribute[attribute$Freq>5,]
view(attribute[order(-attribute$Freq),])
##################################

