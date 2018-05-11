#!/usr/bin/python
from statistics import mean
import pandas as pd

coreweatherstations = set()
core = r'C:\Users\ivazirabad\AdvancedDataScience\YearlyClimate\weather_station_pos\totals\coreweatherstation.txt'
with open(core) as infile:
    infile.readline()
    for line in infile:
        splitline = line.rstrip().split('\t')
        coreweatherstations.add(splitline[-2]+','+splitline[-1])


print('Day\tMonth\tYear\tTAVG')
with open(r'C:\Users\ivazirabad\Downloads\Storm-Severity-Analysis\All_Weather.txt', 'w') as outfile:
    outfile.write('Day\tMonth\tYear\tTAVG\n')
    for i in range(1950, 1951):
        dailydict = {}
        with open(r"C:\Users\ivazirabad\AdvancedDataScience\YearlyClimate\curated_with_lat_long\\"+str(i)+"_with_lat_long.txt") as infile:
            header = infile.readline()
            for line in infile:
                splitline = line.rstrip().split(',')
                day = splitline[-4].zfill(2)
                month = splitline[2].zfill(2)
                date = '\t'.join([day, month, str(i)])
                if date not in dailydict:
                    dailydict[date] = [float(splitline[-1])]
                else:
                    dailydict[date].append(float(splitline[-1]))
            stuff = []
            for k, v in dailydict.items():
                stuff.extend(v)
            print(pd.Series(stuff).describe())