#! /usr/bin/env python

import csv
from xml.dom.minidom import Document

data = csv.DictReader (open("legpoll.csv",'U'))
#Create the XML doc
doc = Document()
#myID = int(0)
#create the base element
docbase = doc.createElement("docbase")
doc.appendChild(docbase)
#balfour = doc.createElement('balfour')
#ralston = doc.createElement('ralston')
#hamrick = doc.createElement('hamrick')
#ramsey = doc.createElement('ramsey')
#rogers = doc.createElement('rogers')
#hill = doc.createElement('hill')
#balfourTotal=0
#QuestionArray= [None]*6
QuestionArray = []
for row in data:
	#myIDstr = row['Question']
	myID = int(row['Question'])
	
	Qid= row['Question']
	if len(QuestionArray) <= myID:
		myQuestion = doc.createElement('myQuestion')
		myQuestion.setAttribute('Qid', Qid)
		myQuestion.setAttribute('label', row['Description'])
		QuestionArray.append(myQuestion)		
	#myQuestion.setAttribute('Response', row['Response'])
	myResponse = doc.createElement('Response')
	myResponse.setAttribute('Label', row['Response'])
	myAnswers = [row['All respondents'], row['Metro'], row['Non-metro'], row['North GA'], row['Central GA'], row['South GA'], row['18-24'], row['25-34'], row['35-44'], row['45-54'], row['65+'], row['Male'], row['Female'], row['No HS'], row['HS GED'], row['Some College'], row['BA'], row['Grad/Professional Degree'], row['Black'], row['White'], row['Yes'], row['Race Other'], row['Democrat'], row['Republican'], row['Party Other'] ]
	myString = "," #this will be the character that joins our list below
	myResponse.appendChild(doc.createTextNode(myString.join(myAnswers)))
	
#	myResponse.setAttribute('Total', row['Total'])
#	myResponse.setAttribute('WithinFiveCounty', row["WithinFiveCounty"])
#	myResponse.setAttribute('OutsideFiveCounty', row["OutsideFiveCounty"])
#	myResponse.setAttribute('FultonorDeKalb', row["FultonorDeKalb"])
	myQuestion.appendChild(myResponse)
		
	
		
#	if(row['COUNTY']=="Sen. Don Balfour"):
	#	global balfourTotal
	#	balfourTotal += float(row['MEDIAN_RATIO'])
#	if(row['COUNTY']=="Sen. Bill Hamrick"):
		#	hamrickTotal += float(row['MEDIAN_RATIO'])
#	COUNTYCol = row['COUNTY']
#	PRICECol = row['PRICE']
#	ZIPCol = row['ZIP']
#	MEDIAN_RATIOCol = row['MEDIAN_RATIO']
	#if(MEDIAN_RATIOCol != 0):
	#	PRICEPercent = PRICECol/MEDIAN_RATIOCol
	#	COUNTYPercent = COUNTYCol/MEDIAN_RATIOCol
	#	johnsonPercent = ZIPCol/MEDIAN_RATIOCol
#	else:
	#	PRICEPerent = 0
	#	COUNTYPercent = 0
	#	johnsonPercent = 0
#create the row element
#	ZIP = doc.createElement('ZIP')
#	ZIP.setAttribute('COUNTY', row['COUNTY'])
#	ZIP.setAttribute('ZIP_CODE', row['ZIP'])
#	ZIP.setAttribute('GAP', row['GAP'])
#	ZIP.setAttribute('PRICE', row['PRICE'])
#	ZIP.setAttribute('SALES', row['SALES'])
	docbase.appendChild(myQuestion)

#balfour.setAttribute('total', balfourTotal)
#docbase.appendChild(balfour)
	#myID += 1
f = open('poll.xml', 'w')
doc.writexml(f, addindent=" ", newl="\n")
f.close()