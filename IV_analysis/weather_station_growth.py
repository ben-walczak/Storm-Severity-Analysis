#!/usr/bin/python

import os, gzip

ghc_stations = {}

with open(r'C:\Users\ivazirabad\AdvancedDataScience\ghcnd-stations.txt') as infile:
    for line in infile:
        splitline = line.rstrip().split('\t')
        ghc_stations[splitline[0]] = (splitline[1], splitline[2])

coreset = set()
for directory, folders, files in os.walk(r'C:\Users\ivazirabad\AdvancedDataScience\YearlyClimate\curated'):
    for f in files:
        littleset = set()
        year = os.path.splitext(f)[0].split('.')[0]
        with gzip.open(os.path.join(directory, f), 'rt') as infile:
            infile.readline()
            for line in infile:
                splitline = line.rstrip().split(',')
                littleset.add(splitline[0][1:-1])
        if year == '1950':
            coreset = coreset.union(littleset)
        else:
            coreset = coreset.intersection(littleset)
        print(year, len(coreset), sep='\t')

with open(os.path.join(r'C:\Users\ivazirabad\AdvancedDataScience\YearlyClimate\weather_station_pos\totals\coreweatherstation2.txt'), 'w') as outfile:
    outfile.write('\t'.join(['Station', 'Lat', 'Long', '\n']))
    for station in coreset:
        if station in ghc_stations:
            outfile.write(station + '\t' + '\t'.join(ghc_stations[station]) + '\n')