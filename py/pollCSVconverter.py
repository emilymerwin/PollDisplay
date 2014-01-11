#! /usr/bin/env python
import csv
from xml.dom.minidom import Document
import decimal

data = csv.DictReader (open("pollLower.csv",'U'))
#Create the XML doc
doc = Document()
#create the base element
docbase = doc.createElement("docbase")
doc.appendChild(docbase)
QuestionArray = []
def checkstring(n):
	stripped = n.strip()
	if "-" == stripped or "*" == stripped or "" == stripped:
		return "0"
	else:
		dec = int(decimal.Decimal(n)*100)
		return str(dec)
for row in data:
	myID = int(row['qnum'])
	Qid= row['qnum']
	if len(QuestionArray) <= myID:
		myQuestion = doc.createElement('myQuestion')
		myQuestion.setAttribute('Qid', Qid)
		myQuestion.setAttribute('label', row['Question'])
		QuestionArray.append(myQuestion)
	responses = row['Responses']
	if responses != "": #data represented as pct in next row, skip over the actual number here (and add the answer label)
		myResponse = doc.createElement('Response')
		myResponse.setAttribute('Label', row['Responses'])
		myQuestion.appendChild(myResponse)
	else:
		myAnswers = [checkstring(row['REGISTERED VOTERS']), checkstring(row['MALE']), checkstring(row['FEMALE']), checkstring(row['DEMOCRAT']), checkstring(row['REPUBLICAN']), checkstring(row['INDEPENDENT']), checkstring(row['WHITE NON-HISPANIC']), checkstring(row['NON-WHITE']), checkstring(row['18-39']), checkstring(row['40-64'])]
		myString = "," #this will be the character that joins our list below
		myResponse.appendChild(doc.createTextNode(myString.join(myAnswers)))

	docbase.appendChild(myQuestion)

f = open('poll.xml', 'w')
doc.writexml(f, addindent=" ", newl="\n")
f.close()