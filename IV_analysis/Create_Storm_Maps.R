library(rworldmap)
files <- list.files(path="C:\\Users\\ivazirabad\\AdvancedDataScience\\StormEvents\\csvfiles\\cleaned", pattern="*.csv", full.names=T, recursive=FALSE)
lapply(files, function(x) {
direct =  unlist(strsplit(x, '/'))[1]
fname = unlist(strsplit(x, '/'))[2]
fpath = paste(direct,'\\plots\\',substr(fname,1,nchar(fname)-14),'.png', sep='')
year = substr(fname, 25, 28)
png(filename=fpath)
data = read.csv(x, stringsAsFactors = FALSE, header = TRUE)
newmap <- getMap(resolution = "low")
plot(newmap, xlim = c(-123, -69), ylim = c(35, 45), asp = 1)
points(data$BEGIN_LON, data$BEGIN_LAT, col = "red", cex = .5)
title(main = paste(year,'US Weather Events'))
dev.off()
})