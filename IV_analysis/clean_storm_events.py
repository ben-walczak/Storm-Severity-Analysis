#!/usr/bin/python

import os, csv

for directory, folders, files in os.walk(r'C:\Users\ivazirabad\AdvancedDataScience\StormEvents\csvfiles\raw'):
    parent = os.path.abspath(os.path.join(directory, os.pardir))
    for f in files:
        if f.startswith('StormEvents'):
            with open(os.path.join(directory, f)) as infile:
                newfile = 'Storm_'+'_'.join(f.split('_')[1:])
                stormreader = csv.reader(infile, delimiter=',', quotechar='"')
                with open(os.path.join(parent, 'cleaned', newfile), 'w') as outfile:
                    writer = csv.writer(outfile, delimiter=',', lineterminator='\n', quotechar='"')
                    for row in stormreader:
                        if row[20] and row[21] and row[22] and row[23] and row[44] and row[45]:  # lat/long and injuries
                            fixedrow = row[12:-3]
                            writer.writerow(fixedrow)

for directory, folders, files in os.walk(r'C:\Users\ivazirabad\AdvancedDataScience\StormEvents\csvfiles\raw'):
    parent = os.path.abspath(os.path.join(directory, os.pardir))
    for f in files:
        with open(os.path.join(directory, f)) as infile:
            newfile = 'Storm_Damages_'+'_'.join(f.split('_')[1:])
            stormreader = csv.reader(infile, delimiter=',', quotechar='"')
            with open(os.path.join(parent, 'damages', newfile), 'w') as outfile:
                writer = csv.writer(outfile, delimiter=',', lineterminator='\n', quotechar='"')
                for row in stormreader:
                    if row[24]:  # Property damage
                        fixedrow = row[12:-3]
                        writer.writerow(fixedrow)
