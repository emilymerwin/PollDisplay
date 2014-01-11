# Poll Display
This ran 9/22/13 as an exclusive to myajc.com <a href="http://www.myajc.com/aca-georgia-poll/">here</a>. The stubbed version for ajc.com ran <a href="http://www.ajc.com/news/aca-georgia-poll-free/">here</a>.
It is part of our series on the Affordable Care Act and Georiga, found <a href="http://www.myajc.com/s/news/healthcare-georgia/">here</a>.
###To do
- [ ] jQuery library is outdated but broke stuff when I tried to update it (I think it's because qTip needs to be upgraded). jQuery UI library is current (as of 9/20/13)
- [ ] add filter buttons to the bottom - they need to mirror the ones on the top but also be functional
- [ ] get rid of qTips
- [ ] filter with drop down instead of the pill buttons (allows for more filters)

###Building the XML
- If you receive data from the polling company as a PDF, DON'T PANIC - they can give it to you in spreadsheet form (it's not the cleanest of spreadsheet templates but better than the PDF). It originates in SPSS, John says it can be read/manipulated with R
- Set up spreadsheet like <a href="https://docs.google.com/spreadsheet/ccc?key=0AowdnjGpuk-idHpZZG9CZnEySGk4SkNtUFBOVUh4R1E&usp=sharing">this</a>
	1. move questions to their own column
	2. delete redundant rows
	3. remove "UNWEIGHTED BASE" and "TOTAL RESPONDENTS" from the file you give the parser, as these are not response tallies but the actual number of people in each category. "NUMBER OF ANSWERS IN THIS TABLE" or equivalent should be deleted also
	4. numbers will come in as strings (eg. 100%"), need to convert before parsing (format --> normal), and python parser will convert to whole numbers (assuming they are only 2 digit percent representations, haven't tested with numbers that need rounding)
	5. it comes over in all CAPS - run it through `py/CSVtoLowercase.py`, which will run `.capitalize()` on each string. Use the resulting CSV as the new source sheet. Go through and fix capitalization as necessary (proper nouns)

- The demographic group title cells often have a few leading spaces, which will break python parser if not accounted for (when specifying column name dict lookups)

- Assumes response totals are in same row as response labels and that following row is the pct representation

- The parser replaces "*", "-" and "" with "0" because those characters were breaking stuff, and if the value is 0 that label won't show up anyway (because it won't have a pixel width, not because it's not added to the DOM, fix that maybe). I believe there are checks in the code to get rid of them but it was still breaking. The polling company uses those symbols to mean either 0 or not a large enough sample.

