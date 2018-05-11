#!/usr/bin/python

#!/usr/bin/python

import os, csv, gzip

ghc_stations = {}

with open(r'C:\Users\ivazirabad\AdvancedDataScience\ghcnd-stations.txt') as infile:
    for line in infile:
        splitline = line.rstrip().split('\t')
        ghc_stations[splitline[0]] = (splitline[1], splitline[2])

for directory, folders, files in os.walk(r'C:\Users\ivazirabad\AdvancedDataScience\YearlyClimate\curated'):
    parent = os.path.abspath(os.path.join(directory, os.pardir))
    for f in files:
        filename = os.path.splitext(f)[0]
        with gzip.open(os.path.join(directory, f), 'rt') as infile:
            header = infile.readline().split(',')
            climatereader = csv.reader(infile, delimiter=',', quotechar='"')
            with open(os.path.join(parent, 'curated_with_lat_long', filename[:-4]+'_with_lat_long.txt'), 'w') as outfile:
                outfile.write('"Lat","Long",'+','.join(header[1:]))
                for row in climatereader:
                    if row[0] in ghc_stations:
                        outfile.write(','.join(ghc_stations[row[0]])+','+','.join(row[1:])+'\n')
