#!/usr/bin/python
import os, csv
from math import fabs, cos, asin, sqrt
from datetime import datetime as dt
origfolder = r'C:\Users\ivazirabad\AdvancedDataScience\StormEvents\csvfiles\cleaned\split_files'


def distance(lat1, lon1, lat2, lon2):
    p = 0.017453292519943295
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2
    return 12742 * asin(sqrt(a))


def closest(data, v):
    return min(data, key=lambda p: distance(v[0], v[1], float(p.split('_')[0]), float(p.split('_')[1])))


def buildclimatedict(path):
    climatedict = {}
    year = ''
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
    filtered_stations = set()
    for k, v in climatedict.items():
        if len(v) < 364:
            filtered_stations.add(k)
    for k in filtered_stations:
        del climatedict[k]

    print(year, len(filtered_stations), len(climatedict), round(len(filtered_stations)/(len(climatedict)+len(filtered_stations)), 2), sep='\t')
    return climatedict

flag = False
for directory, folders, files in os.walk(origfolder):
    with open(r"C:\Users\ivazirabad\AdvancedDataScience\StormEvents\csvfiles\cleaned\Processed_Storm_Data_coreweatherstations.csv", 'w') as outfile:
        for f in files:
            with open(os.path.join(directory, f)) as infile:
                header = infile.readline().rstrip() + ',BestLat,BestLong,TAVG\n'
                if not flag:
                    outfile.write(header)
                    flag = True
                stormreader = csv.reader(infile, delimiter=',', quotechar='"')
                year = str(os.path.basename(f).split('_')[0][:-4])
                filename = "C:\\Users\\ivazirabad\\AdvancedDataScience\\YearlyClimate\\curated_with_lat_long\\" + year + "_with_lat_long.txt"
                clim_dict = buildclimatedict(filename)
                '''success = 0
                failure = 0
                for splitline in stormreader:
                    if splitline[-4] and splitline[-3]:  # if lat and long
                        best_match_latlong = closest(clim_dict.keys(), [float(splitline[-4]), float(splitline[-3])])
                        bestlat = best_match_latlong.split('_')[0]
                        bestlong = best_match_latlong.split('_')[1]
                        dateevent = dt.strptime(splitline[6].split(' ')[0][:-2]+splitline[2], '%d-%b-%Y')
                        parsed_dateevent = dt.strftime(dateevent, '%m-%d-%Y')
                        if parsed_dateevent in clim_dict[best_match_latlong]:
                            success += 1
                            temperature = clim_dict[best_match_latlong][parsed_dateevent]
                            #print(year, splitline[0], splitline[1], best_match_latlong, splitline[5], splitline[6], temperature, sep='\t')
                            #outfile.write('\t'.join([year, splitline[0], splitline[1], best_match_latlong, splitline[5], splitline[6], bestlat, bestlong, temperature])+'\n')
                            splitline.extend([bestlat, bestlong, temperature])
                            outfile.write(','.join(splitline) + '\n')
                    else:
                        print(splitline, 'DAMN')
                print(year, success, failure, sep='\t')'''