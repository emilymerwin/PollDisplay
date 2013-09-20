# Poll Display
-If you receive data from the polling company as a PDF, DON'T PANIC - they can give it to you in spreadsheet form (it's not the cleanest of spreadsheet templates but better than the PDF)
	-note that the demographic group title cells often have a few leading spaces, which could break your python parser if you don't know they are there
	-numbers will come in as strings "100%" etc, need to convert before parsing (format --> normal)
	-make sure to remove "UNWEIGHTED BASE" and "TOTAL RESPONDENTS" from the file you give the parser, as these are not percentages but the actual number of people in each category
	-it comes over in all caps - next time try downloading, converting the data to downcase locally (find and replace regex probably easiest) then re-upload to Google and go through and make sure the appropriate things are uppercase (think proper nouns).
	