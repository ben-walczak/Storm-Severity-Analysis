#!/usr/bin/python

import os, csv, statistics, gzip

avgdict = {}
coreweatherstations = []

stationfile = r"C:\Users\ivazirabad\AdvancedDataScience\YearlyClimate\weather_station_pos\totals\coreweatherstation.txt"
with open(stationfile) as infile:
    infile.readline()
    for line in infile:
        splitline = line.rstrip().split('\t')
        coreweatherstations.append(splitline[0])

for directory, folders, files in os.walk(r'C:\Users\ivazirabad\AdvancedDataScience\YearlyClimate\curated'):
    for f in files:
        filename = os.path.splitext(f)[0][:-4]
        print(filename)
        with gzip.open(os.path.join(directory, f), 'rt') as infile:
            infile.readline()
            climatereader = csv.reader(infile, delimiter=',', quotechar='"')
            for row in climatereader:
                if row[0] in coreweatherstations:
                    if filename not in avgdict:
                        avgdict[filename] = [float(row[-1])]
                    else:
                        avgdict[filename].append(float(row[-1]))
            avgdict[filename] = statistics.mean(avgdict[filename])
for k, v in avgdict.items():
    print(k, v, sep='\t')