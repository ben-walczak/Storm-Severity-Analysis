library(dplyr)        # Data manipulation
library(knitr)        # Dynamic report generation
library(lubridate)    # Date and time processing
library(reshape2)     # Data transposition

# Reads every yearly climate file and reshapes it, getting TAVG
# Copied from https://rpubs.com/tterryt2/wdea_pt5
files <- list.files(path="C:\\Users\\ivazirabad\\AdvancedDataScience\\YearlyClimate\\by_year", pattern="*.csv.gz", full.names=T, recursive=FALSE)
lapply(files, function(x) {
wd_data <- read.csv(x, sep=",",header=FALSE, stringsAsFactors = FALSE)
wd_data <- wd_data %>% select(-V5,-V6,-V7,-V8)
kable(head(wd_data), caption = "wd_data")
format(nrow(wd_data), big.mark = ",")
format(length(unique(wd_data$V1)), big.mark = ",")
temp_vals <- c("TMAX", "TMIN", "TAVG")
wd_data <- wd_data %>% filter(V3 %in% temp_vals)
kable(head(wd_data), caption = "wd_data")
wd_data <- dcast(wd_data, V1 + V2 ~ V3, value.var = "V4")
colnames(wd_data)[1] <- "ID"
colnames(wd_data)[2] <- "Date"
summary(wd_data[3:5])
wd_data <- subset(wd_data, grepl('^US', ID) )
wd_data$TAVG <- replace(wd_data$TAVG, wd_data$TAVG == -999, NA)
wd_data$TMAX <- replace(wd_data$TMAX, wd_data$TMAX == -999, NA)
wd_data$TMIN <- replace(wd_data$TMIN, wd_data$TMIN == -999, NA)
summary(wd_data[3:5])
wd_data$TAVG = wd_data$TAVG/10
wd_data$TMAX <- wd_data$TMAX/10
wd_data$TMIN <- wd_data$TMIN/10
nrow(filter(wd_data, TAVG > 134.1  | TMAX > 134.1  | TMIN > 134.1))
wd_data$TAVG <- replace(wd_data$TAVG, wd_data$TAVG > 134.1, NA)
wd_data$TMAX <- replace(wd_data$TMAX, wd_data$TMAX > 134.1, NA)
wd_data$TMIN <- replace(wd_data$TMIN, wd_data$TMIN > 134.1, NA)
wd_data$TAVG <- replace(wd_data$TAVG, wd_data$TAVG < -128.6, NA)
wd_data$TMAX <- replace(wd_data$TMAX, wd_data$TMAX < -128.6, NA)
wd_data$TMIN <- replace(wd_data$TMIN, wd_data$TMIN < -128.6, NA)

nrow(filter(wd_data, TMIN > TMAX))
wd_data$TMIN <- replace(wd_data$TMIN, wd_data$TMIN > wd_data$TMAX, NA)
wd_data <- wd_data %>% mutate(DAVG = (TMAX + TMIN) / 2)
kable(head(wd_data, 10), caption = "wd_data")
wd_data <- wd_data %>%transform(TAVG = ifelse(is.na(TAVG), DAVG, TAVG))
nbr_day <- 366                                          ## 2016 has 366 days
tot_obs <- nrow(wd_data)
com_obs <- nrow(subset(wd_data, !is.na(wd_data$TAVG)))
tot_sta <- length(unique(wd_data$ID))
pot_obs <- tot_sta * nbr_day
cat(paste("  Number of Observation Stations:   ", "   ", format(tot_sta, big.mark = ","),  "\n",
          "Number of Potential Observations:   ",        format(pot_obs, big.mark = ","),  "\n",
          "   Number of Actual Observations:   ",        format(tot_obs, big.mark = ","),  "\n",
          " Number of Complete Observations:   ",        format(com_obs, big.mark = ","),  sep = ""))
wd_data <- wd_data %>% select(-DAVG)
summary(wd_data$TAVG)
wd_data <- wd_data[complete.cases(wd_data),]
summary(wd_data$TAVG)
tot_obs <- nrow(wd_data)
com_obs <- nrow(subset(wd_data, !is.na(wd_data$TAVG)))
tot_sta <- length(unique(wd_data$ID))
pot_obs <- tot_sta * nbr_day
pct_com <- round(com_obs/pot_obs * 100, 2)
wd_data$Date <- ymd(wd_data$Date)

wd_data$Month <- month(wd_data$Date)
wd_data$Week  <- week(wd_data$Date)
wd_data$day  <- day(wd_data$Date)
kable(head(wd_data), caption = "wd_data")
wd_data <- wd_data %>%
  select(ID, Month, Week, day, TMAX, TMIN, TAVG)

direct =  unlist(strsplit(x, '/'))[1]
fname = unlist(strsplit(x, '/'))[2]
fpath = paste(direct,'\\R_touched\\',substr(fname,1,nchar(fname)-6),'csv', sep='')
write.csv(wd_data,fpath,row.names=FALSE,na="NA")
})