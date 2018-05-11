#!/usr/bin/python
import csv

myfile = r"C:\Users\ivazirabad\AdvancedDataScience\StormEvents\csvfiles\cleaned\Processed_Storm_Data_cleaned.csv"
yeardict = {}
header = ''
with open(myfile) as infile:
    header = infile.readline()
    stormreader = csv.reader(infile, delimiter=',', quotechar='"')
    for splitline in stormreader:
        if splitline[2] not in yeardict:
            yeardict[splitline[2]] = [splitline]
        else:
            yeardict[splitline[2]].append(splitline)

for k, v, in yeardict.items():
    with open(r'C:\Users\ivazirabad\AdvancedDataScience\StormEvents\csvfiles\cleaned\split_files\\'+k+'.csv', 'w', newline='') as outfile:
        outfile.write(header)
        stormwriter = csv.writer(outfile, delimiter=',', quotechar='"')
        for row in v:
            stormwriter.writerow(row)