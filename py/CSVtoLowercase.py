#! /usr/bin/env python
import csv

ifile  = open('../docs/30080 GA Poll Banner TableMay2014 - may2014.csv', "rb")
reader = csv.reader(ifile)
ofile  = open('../docs/mayLower.csv', "wb")
writer = csv.writer(ofile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

for row in reader:
	row[1] = row[1].capitalize()
	row[2] = row[2].capitalize()
	writer.writerow(row)

ifile.close()
ofile.close()