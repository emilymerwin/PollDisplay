# Poll Display
- [Demo](http://www.myajc.com/news/middle-class-poll/)
- See branches for more examples

###To do
- [ ] jQuery library is outdated but broke stuff when I tried to update it (I think it's because qTip needs to be upgraded). jQuery UI library is current (as of 9/20/13)
- [ ] get rid of qTips
- [ ] filter with drop down instead of the pill buttons (allows for more filters)
- [ ] Add a way to compare historical responses to same question
- [ ] Add answer base? eg. Likely voters vs undecided etc
- [ ] Better capitalization script - should automatically capitalize 1st char in cell and 1st char after ". ". Maybe even fix common words like Georgia, Congress, U.S., Senate, America, Obama etc.
- [ ] Build an editor to allow color selection - sometimes you want the color to mean something and this does them in order
- [ ] Is there a fix for the awkward text wrapping? Maybe truncate with "..."?

###Building the XML
- If you receive data from the polling company as a PDF, DON'T PANIC - they can give it to you in spreadsheet form (it's not the cleanest of spreadsheet templates but better than the PDF). It originates in SPSS, John says it can be read/manipulated with R
- Set up spreadsheet like <a href="https://docs.google.com/spreadsheets/d/1Jr_sDRJTEBg3BDvQ8JGH5IhBl34TaE2QP4ZGxD2C398/edit?usp=sharing">this</a>
	1. move questions to their own column
	2. delete redundant rows
	3. remove "UNWEIGHTED BASE" and "TOTAL RESPONDENTS" from the file you give the parser, as these are not response tallies but the actual number of people in each category. "NUMBER OF ANSWERS IN THIS TABLE" or equivalent should be deleted also. DO NOT DELETE REGISTERED VOTERS COLUMN
	4. numbers will come in as strings (eg. 100%"), need to convert before parsing (format --> normal in Google Sheets, format cells --> general in Excel). The python parser will convert to whole numbers later (assuming they are only 2 digit percent representations, haven't tested with numbers that need rounding)
	5. Save as CSV if it's not a CSV already
	6. it comes over in all CAPS (or at least it used to)- run it through `py/CSVtoLowercase.py`, which will run `.capitalize()` on each string. Use the resulting CSV as the new source sheet. Go through and fix capitalization as necessary (proper nouns, titles etc)
	7. Create a new folder for your poll in the /data/ directory and save your CSV there
	8. Open `py/pollCSVconverter.py`, replace `infile` and `outfile` (lines 6 and 7) and run the script ( `cmd` + `shift` + `r` in textmate, or `python `)
	9. Open `dist/poll.js`.  Replace the URL on line 4 with your new data file . Update `labelArr` on line 14 with your spreadsheet's column headers (they need to be in the same order as they appear in your CSV - all arrays are loaded by index so if your column name is in the wrong spot it will display the wrong data when the filter is clicked)
	10. Check locally using `python -m simpleHTTPServer`
	11. Upload to AWS, make public `aws s3 cp ./dist s3://ajcnewsapps.myajc.com/2019/polls/[your-poll] --recursive --acl public-read`
	12. Add to Methode via iFrame on a flatpage


####Troubleshooting
- The demographic group title cells often have a few leading spaces, which will break python parser if not accounted for (when specifying column name dict lookups)

- Assumes response totals are in same row as response labels and that following row is the pct representation

- The parser replaces "*", "-" and "" with "0" because those characters were breaking stuff, and if the value is 0 that label won't show up anyway (because it won't have a pixel width, not because it's not added to the DOM, fix that maybe). I believe there are checks in the code to get rid of them but it was still breaking. The polling company uses those symbols to mean either 0 or not a large enough sample.

