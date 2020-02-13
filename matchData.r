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

setwd("C:/Users/KTH/Desktop/python")

UserDB <- read.csv("matchId.csv")
UserDB
UserDB<- unique(UserDB)
UserDB
view(UserDB)
