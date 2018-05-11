#!/usr/bin/python

import os, csv

citiesdict = {}
with open(r"C:\Users\ivazirabad\Downloads\Storm-Severity-Analysis\references\uscitiesv1.4.csv", encoding="utf8") as infile:
    for line in infile:
        splitline = line.rstrip().split(',')
        county = splitline[-3].lower()
        state = splitline[3].lower()
        citiesdict['-'.join([county, state])] = (splitline[-2], splitline[-1])


with open(r'C:\Users\ivazirabad\AdvancedDataScience\StormEvents\csvfiles\cleaned\recap.csv', 'w', newline='') as outfile:
    stormwriter = csv.writer(outfile, delimiter=',', quotechar='"')
    flag = False
    for directory, folders, files in os.walk(r'C:\Users\ivazirabad\AdvancedDataScience\StormEvents\csvfiles\raw'):
        for f in files:
            total = 0
            missed = 0
            missing_latlong = 0
            success = 0
            infile = open(os.path.join(directory, f))
            header = ','.join(infile.readline().rstrip().split(',')[8:-5])
            year = str(os.path.basename(f).split('_')[3][1:])
            if not flag:
                outfile.write(header+'\n')
                flag = True
            stormreader = csv.reader(infile, delimiter=',', quotechar='"')
            for splitline in stormreader:
                total += 1
                newsplit = splitline[8:-5]
                if not newsplit[-2] or not newsplit[-1]:
                    missing_latlong += 1
                    state = newsplit[0].lower()
                    county = newsplit[7].lower()
                    key = '-'.join([county, state])
                    if key in citiesdict:
                        success += 1
                        lat, long = citiesdict[key]
                        newsplit[-2] = lat
                        newsplit[-1] = long
                        stormwriter.writerow(newsplit)
                    else:
                        missed += 1
            print(year, missing_latlong, missed, success, total, sep='\t')