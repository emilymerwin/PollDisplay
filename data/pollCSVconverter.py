#! /usr/bin/env python
import csv
from xml.dom.minidom import Document

data = csv.DictReader (open("ACApoll.csv",'U'))
#Create the XML doc
doc = Document()
#create the base element
docbase = doc.createElement("docbase")
doc.appendChild(docbase)
QuestionArray = []
def checkstring(n):
	if "- " == n or "* " == n:
		return "0"
	else:
		return n
for row in data:
	myID = int(row['qnum'])
	Qid= row['qnum']
	if len(QuestionArray) <= myID:
		myQuestion = doc.createElement('myQuestion')
		myQuestion.setAttribute('Qid', Qid)
		myQuestion.setAttribute('label', row['questionRichards'])
		QuestionArray.append(myQuestion)
	myResponse = doc.createElement('Response')
	myResponse.setAttribute('Label', row['richardResponses'])
	myAnswers = [checkstring(row['TOTAL RESPONDENTS']), checkstring(row['ATLANTA METRO']), checkstring(row['MALE']), checkstring(row['FEMALE']), checkstring(row['WHITE']), checkstring(row['NON-WHITE']), checkstring(row['insured']), checkstring(row['uninsured'])]
	myString = "," #this will be the character that joins our list below
	myResponse.appendChild(doc.createTextNode(myString.join(myAnswers)))
	myQuestion.appendChild(myResponse)

	docbase.appendChild(myQuestion)

f = open('poll.xml', 'w')
doc.writexml(f, addindent=" ", newl="\n")
f.close()