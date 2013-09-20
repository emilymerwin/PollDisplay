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
for row in data:
	myID = int(row['qnum'])
	Qid= row['qnum']
	if len(QuestionArray) <= myID:
		myQuestion = doc.createElement('myQuestion')
		myQuestion.setAttribute('Qid', Qid)
		myQuestion.setAttribute('label', row['questionRichards'])
		QuestionArray.append(myQuestion)
	myResponse = doc.createElement('Response')
	myResponse.setAttribute('Label', row['responses'])
	myAnswers = [row['TOTAL RESPONDENTS'], row['MALE'], row['FEMALE'], row['WHITE'], row['NON-WHITE'], row['ATLANTA METRO'], row['insured'], row['uninsured']]
	myString = "," #this will be the character that joins our list below
	myResponse.appendChild(doc.createTextNode(myString.join(myAnswers)))
	myQuestion.appendChild(myResponse)

	docbase.appendChild(myQuestion)

f = open('poll.xml', 'w')
doc.writexml(f, addindent=" ", newl="\n")
f.close()