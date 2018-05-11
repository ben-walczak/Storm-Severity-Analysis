#!/usr/bin/python

import os, csv, statistics

maxdict = {}
mindict = {}
for directory, folders, files in os.walk(r'C:\Users\ivazirabad\AdvancedDataScience\YearlyClimate\curated'):
    for f in files:
        filename = os.path.splitext(f)[0]
        print(filename)
        with open(os.path.join(directory, f)) as infile:
            infile.readline()
            climatereader = csv.reader(infile, delimiter=',', quotechar='"')
            for row in climatereader:
                if filename not in maxdict:
                    maxdict[filename] = [float(row[-3])]
                else:
                    maxdict[filename].append(float(row[-3]))
                if filename not in mindict:
                    mindict[filename] = [float(row[-2])]
                else:
                    mindict[filename].append(float(row[-2]))
            maxdict[filename] = statistics.mean(maxdict[filename])
            mindict[filename] = statistics.mean(mindict[filename])
print('\nMAX')
for k, v in maxdict.items():
    print(k, v, sep='\t')
print('\nMIN')
for k, v in mindict.items():
    print(k, v, sep='\t')