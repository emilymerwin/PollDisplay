#! /usr/bin/env python
import csv

ifile  = open('../data/May2016/May2016poll.csv', "rU")
reader = csv.reader(ifile)
ofile  = open('../data/may2016Lower.csv', "wb")
writer = csv.writer(ofile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

for row in reader:
	row[1] = row[1].capitalize()
	row[2] = row[2].capitalize()
	writer.writerow(row)

ifile.close()
ofile.close()