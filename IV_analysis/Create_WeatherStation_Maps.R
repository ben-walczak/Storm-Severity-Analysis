library(rworldmap)
files <- list.files(path="C:\\Users\\ivazirabad\\AdvancedDataScience\\YearlyClimate\\weather_station_pos", pattern="*.txt", full.names=T, recursive=FALSE)
lapply(files, function(x) {
  direct =  unlist(strsplit(x, '/'))[1]
  fname = unlist(strsplit(x, '/'))[2]
  fpath = paste(direct,'\\plots\\',substr(fname,1,nchar(fname)-4),'.png', sep='')
  year = substr(fname, 1, 4)
  png(filename=fpath)
  data = read.csv(x, stringsAsFactors = FALSE, header = TRUE, sep = '\t')
  newmap <- getMap(resolution = "low")
  plot(newmap, xlim = c(-123, -69), ylim = c(30, 50), asp = 1)
  points(data$Long, data$Lat, col = "red", cex = .5)
  title(main = paste('Core Weather Stations 1900-2017'))
  dev.off()
})