#!/usr/bin/python

import csv
import pandas as pd
from math import cos, asin, sqrt
filename = r"C:\Users\ivazirabad\AdvancedDataScience\StormEvents\csvfiles\cleaned\Processed_Storm_Data_IV_Edit.csv"

def distance(lat1, lon1, lat2, lon2):
    p = 0.017453292519943295
    a = 0.5 - cos((lat2-lat1)*p)/2 + cos(lat1*p)*cos(lat2*p) * (1-cos((lon2-lon1)*p)) / 2
    return 12742 * asin(sqrt(a))

alldistance = []
with open(filename) as infile:
    infile.readline()
    stormreader = csv.reader(infile, delimiter=',', quotechar='"')
    for splitline in stormreader:
        lat1 = float(splitline[-7])
        long1 = float(splitline[-6])
        lat2 = float(splitline[-3])
        long2 = float(splitline[-2])
        d = round(distance(lat1, long1, lat2, long2), 3)
        if d > 30:
            alldistance.append(d)
            #print(','.join(splitline[:6]), d, sep='\t')

print(pd.Series(alldistance).describe().apply(lambda x: format(x, 'f')))