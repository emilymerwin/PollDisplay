# Poll Display
This ran 9/22/13 as an exclusive to myajc.com <a href="http://www.myajc.com/aca-georgia-poll/">here</a>. The stubbed version for ajc.com ran <a href="http://www.ajc.com/news/aca-georgia-poll-free/">here</a>.
It is part of our series on the Affordable Care Act and Georiga, found <a href="http://www.myajc.com/s/news/healthcare-georgia/">here</a>.
###To do
[ ] jQuery library is outdated but broke stuff when I tried to update it (I think it's because qTip needs to be upgraded). jQuery UI library is current (as of 9/20/13)
[ ] add filter buttons to the bottom - they need to mirror the ones on the top but also be functional
[ ] get rid of qTips
[ ] filter with drop down instead of the pill buttons (allows for more filters)

###Building the XML
- If you receive data from the polling company as a PDF, DON'T PANIC - they can give it to you in spreadsheet form (it's not the cleanest of spreadsheet templates but better than the PDF)
- set up spreadsheet like <a href="https://docs.google.com/spreadsheet/ccc?key=0AowdnjGpuk-idHpZZG9CZnEySGk4SkNtUFBOVUh4R1E&usp=sharing">this</a>

- note that the demographic group title cells often have a few leading spaces, which could break your python parser if you don't know they are there

- numbers will come in as strings "100%" etc, need to convert before parsing (format --> normal), and python parser will convert to whole numbers (assuming they are only 2 digits percent representations, haven't tested with numbers that need rounding)

- ACA poll is using a column of edited "response" fields separate from the defaults, which are in the original .csv - parser checks for this and removes those that do not have text in the edited response field

- make sure to remove "UNWEIGHTED BASE" and "TOTAL RESPONDENTS" from the file you give the parser, as these are not percentages but the actual number of people in each category

- it comes over in all caps - next time try downloading, converting the data to downcase locally (find and replace regex probably easiest) then re-upload to Google and go through and make sure the appropriate things are uppercase (think proper nouns).

- FYI the parser is set to replace "* ", "- " and " " with "0" because those characters were breaking stuff, and if the value is 0 that label won't show up anyway (because it won't have a pixel width, not because it's not added to the DOM, fix that maybe). I believe there are checks in the code to get rid of them but it was still breaking. The polling company uses those symbols to mean either 0 or not a large enough sample.

