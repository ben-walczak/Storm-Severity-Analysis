#!/usr/bin/python

import os, csv, gzip

ghc_stations = {}

with open(r'C:\Users\ivazirabad\AdvancedDataScience\ghcnd-stations.txt') as infile:
    for line in infile:
        splitline = line.rstrip().split('\t')
        ghc_stations[splitline[0]] = (splitline[1], splitline[2])

for directory, folders, files in os.walk(r'C:\Users\ivazirabad\AdvancedDataScience\YearlyClimate\curated'):
    parent = os.path.abspath(os.path.join(directory, os.pardir))
    with open(os.path.join(parent, 'weather_station_pos\\totals\\weather_growth.txt'), 'w') as growth:
        growth.write('Year\tNumber\n')
        for f in files:
            filename = os.path.splitext(f)[0]
            weather_stations = set()
            with gzip.open(os.path.join(directory, f), 'rt') as infile:
                infile.readline()
                climatereader = csv.reader(infile, delimiter=',', quotechar='"')
                for row in climatereader:
                    weather_stations.add(row[0])
            with open(os.path.join(parent, 'weather_station_pos', filename[:-4]+'_weather_stations.txt'), 'w') as outfile:
                outfile.write('\t'.join(['Station', 'Lat', 'Long', '\n']))
                for station in weather_stations:
                    if station in ghc_stations:
                        outfile.write(station+'\t'+'\t'.join(ghc_stations[station])+'\n')
            growth.write('\t'.join([filename[:-4], str(len(weather_stations))])+'\n')