#! /usr/bin/env python
import csv

ifile  = open('30019 GA Poll Banner Table - pollLower.csv', "rb")
reader = csv.reader(ifile)
ofile  = open('pollLower.csv', "wb")
writer = csv.writer(ofile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

for row in reader:
	row[1] = row[1].capitalize()
	row[2] = row[2].capitalize()
	writer.writerow(row)

ifile.close()
ofile.close()