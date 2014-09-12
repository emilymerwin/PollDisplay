#! /usr/bin/env python
import csv
from xml.dom.minidom import Document
import decimal

data = csv.reader (open("../data/ajc poll-sept2014-edits.csv",'U'))
#Create the XML doc
doc = Document()
#create the base element
docbase = doc.createElement("docbase")
doc.appendChild(docbase)
QuestionArray = []
data.next()
def checkstring(n):
	stripped = n.strip() #sometimes the fields we're checking for below come through with whitespace attatched
	if "-" == stripped or "*" == stripped or "" == stripped:
		return "0"
	else:
		dec = int(decimal.Decimal(n)*100)
		return str(dec)
for row in data:
	myAnswers = []
	myID = int(row[0])
	Qid= row[0]
	if len(QuestionArray) <= myID:
		myQuestion = doc.createElement('myQuestion')
		myQuestion.setAttribute('Qid', Qid)
		myQuestion.setAttribute('label', row[1])
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

f = open('../data/poll_sept2014.xml', 'w')
doc.writexml(f, addindent=" ", newl="\n")
f.close()