#! /usr/bin/env python
# NOTE: This code is python 3 - change the path above if your path to python 3 is different
import csv
from xml.dom.minidom import Document
import decimal

infile = "../data/jan2020/poll-jan-2020.csv" #path to the source CSV
outfile = "jan2020-poll.xml" #filename for the generated XML to be used 

#Create the XML doc
doc = Document()
#create the base element
docbase = doc.createElement("docbase")
doc.appendChild(docbase)
QuestionArray = []

def checkstring(n):
	stripped = n.strip() #sometimes the fields we're checking for below come through with whitespace attatched
	if "-" == stripped or "*" == stripped or "" == stripped: #fix non-character nulls
		return "0"
	else:
		dec = round(decimal.Decimal(n)*100,1)
		return str(dec)

with open(infile, 'rU', encoding='latin-1') as data:
	reader = csv.reader(data, dialect='excel')
	next(reader)
	for row in reader:
		myAnswers = []
		myID = int(row[0])
		Qid= row[0]
		if len(QuestionArray) <= myID:
			myQuestion = doc.createElement('myQuestion')
			myQuestion.setAttribute('Qid', Qid)
			myQuestion.setAttribute('label', row[1].replace('Õ','\'').replace('Ê',' '))
			QuestionArray.append(myQuestion)
		responses = row[2]
		if responses != "": #data represented as pct in next row, skip over the actual number here (and add the answer label)
			myResponse = doc.createElement('Response')
			myResponse.setAttribute('Label', responses)
			myQuestion.appendChild(myResponse)
		else:
			for i, v in enumerate(row):
				if i > 2: #cols 0-2 are string fields
					myAnswers.append(checkstring(v))
			myString = "," #this will be the character that joins our list below
			myResponse.appendChild(doc.createTextNode(myString.join(myAnswers)))

		docbase.appendChild(myQuestion)

f = open('../dist/' + outfile, 'w')
doc.writexml(f, addindent=" ", newl="\n")
f.close()