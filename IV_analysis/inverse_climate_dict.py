#!/usr/bin/python
import os, csv
from math import fabs, cos, asin, sqrt
from datetime import datetime as dt
stormfile = r"C:\Users\ivazirabad\AdvancedDataScience\Storm-Severity-Analysis\Processed_Storm_Data\Processed_Storm_Data.csv"
origfolder = r'C:\Users\ivazirabad\AdvancedDataScience\Storm-Severity-Analysis\Processed_Storm_Data\split_files'


def distance(lat1, lon1, lat2, lon2):
    p = 0.017453292519943295
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2
    return 12742 * asin(sqrt(a))


def closest(data, v):
    return min(data, key=lambda p: distance(v[0], v[1], float(p.split('_')[0]), float(p.split('_')[1])))


def buildclimatedict(path):
    climatedict = {}
    year = 0
    with open(path) as infile:
        infile.readline()
        year = str(os.path.basename(f).split('_')[0][:-4])
        for line in infile:
            splitline = line.rstrip().split(',')
            lat_long = '_'.join(splitline[0:2])
            date = '-'.join([splitline[2].zfill(2), splitline[4].zfill(2), year])
            tavg = splitline[-1]
            if lat_long not in climatedict:
                climatedict[lat_long] = {date: tavg}
            else:
                climatedict[lat_long][date] = tavg
    mysize = []
    for k, v in climatedict.items():
        if len(v) < 360:
            mysize.append(k)
    for k in mysize:
        del climatedict[k]
    #print(year, len(mysize), len(climatedict), round(len(mysize)/(len(climatedict)+len(mysize)), 2), sep='\t')
    return climatedict

flag = False
for directory, folders, files in os.walk(r'C:\Users\ivazirabad\AdvancedDataScience\Storm-Severity-Analysis\Processed_Storm_Data\split_files'):
    with open(r"C:\\Users\ivazirabad\AdvancedDataScience\Storm-Severity-Analysis\Processed_Storm_Data\Storm_data_no_lat_long.csv", 'w') as outfile:
        for f in files:
            with open(os.path.join(directory, f)) as infile:
                header = infile.readline().rstrip() + ',TAVG\n'
                if not flag:
                    outfile.write(header)
                    flag = True
                stormreader = csv.reader(infile, delimiter=',', quotechar='"')
                year = str(os.path.basename(f).split('_')[0][:-4])
                filename = "C:\\Users\\ivazirabad\\AdvancedDataScience\\YearlyClimate\\curated_with_lat_long\\" + year + "_with_lat_long.txt"
                #clim_dict = buildclimatedict(filename)
                success = 0
                failure = 0
                for splitline in stormreader:
                    if splitline[5] and splitline[6]:  # if lat and long
                        pass
                        '''best_match_latlong = closest(clim_dict.keys(), [float(splitline[5]), float(splitline[6])])
                        dateevent = dt.strptime(splitline[2], '%m/%d/%Y %H:%M')
                        parsed_dateevent = dt.strftime(dateevent, '%m-%d-%Y %H:%M').split(' ')[0]
                        if parsed_dateevent in clim_dict[best_match_latlong]:
                            success += 1
                            temperature = clim_dict[best_match_latlong][parsed_dateevent]
                            #print(year, splitline[0], splitline[1], best_match_latlong, splitline[5], splitline[6], temperature, sep='\t')
                            splitline.append(temperature)
                            outfile.write(','.join(splitline) + '\n')
                        else:
                            #print('Failure', year, splitline[0], splitline[1], best_match_latlong, parsed_dateevent, sep='\t')
                            failure += 1'''
                    else:
                        outfile.write(','.join(splitline)+'\n')
                print(year, success, failure, sep='\t')