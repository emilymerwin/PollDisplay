#! /usr/bin/env python
import csv
from xml.dom.minidom import Document

data = csv.DictReader (open("legpoll.csv",'U'))
#Create the XML doc
doc = Document()
#create the base element
docbase = doc.createElement("docbase")
doc.appendChild(docbase)
QuestionArray = []
for row in data:
	myID = int(row['Question'])
	Qid= row['Question']
	if len(QuestionArray) <= myID:
		myQuestion = doc.createElement('myQuestion')
		myQuestion.setAttribute('Qid', Qid)
		myQuestion.setAttribute('label', row['Description'])
		QuestionArray.append(myQuestion)
	myResponse = doc.createElement('Response')
	myResponse.setAttribute('Label', row['Response'])
	myAnswers = [row['All respondents'], row['Metro'], row['Non-metro'], row['North GA'], row['Central GA'], row['South GA'], row['18-24'], row['25-34'], row['35-44'], row['45-54'], row['65+'], row['Male'], row['Female'], row['No HS'], row['HS GED'], row['Some College'], row['BA'], row['Grad/Professional Degree'], row['Black'], row['White'], row['Yes'], row['Race Other'], row['Democrat'], row['Republican'], row['Party Other'] ]
	myString = "," #this will be the character that joins our list below
	myResponse.appendChild(doc.createTextNode(myString.join(myAnswers)))
	myQuestion.appendChild(myResponse)

	docbase.appendChild(myQuestion)

f = open('poll.xml', 'w')
doc.writexml(f, addindent=" ", newl="\n")
f.close()