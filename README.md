# Poll Display
- [Demo](https://www.ajc.com/news/atlanta-news/interactive-poll-of-atlanta-voters-november-2021/UYSQL7CNXFAHBMG2KK2JNYLE4E/)
- Create a new branch off of `master` for each poll, and merge your branch into master when finished. Push both branches to BitBucket.

### Building the XML (Isaac Sabetai usually does this part)
- If you receive data from the polling company as a PDF, DON'T PANIC - they can give it to you in spreadsheet form (it's not the cleanest of spreadsheet templates but better than the PDF). It originates in SPSS, John says it can be read/manipulated with R, but just have them send you a spreadsheet.
- Create a new spreadsheet using this template <a href="https://docs.google.com/spreadsheets/d/1Jr_sDRJTEBg3BDvQ8JGH5IhBl34TaE2QP4ZGxD2C398/edit?usp=sharing">this</a>
	1. move questions to their own column
	2. delete redundant rows
	3. remove "UNWEIGHTED BASE" and "TOTAL RESPONDENTS" from the file you give the parser, as these are not response tallies but the actual number of people in each category. "NUMBER OF ANSWERS IN THIS TABLE" or equivalent should be deleted also. DO NOT DELETE REGISTERED VOTERS COLUMN
	4. numbers will come in as strings (eg. 100%"), need to convert before parsing (format --> normal in Google Sheets, format cells --> general in Excel). The python parser will convert to whole numbers later.
  
### Creating the graphic (Emily DiRico usually does this)
- Open file from Isaac in Excel. Double check that the numbers are strings (format --> normal in Google Sheets, or [select columns] --> [right click] --> `Format Cells...` --> `General` in Excel). Save as CSV in new folder for your poll (`data/[monthYear]/`)
- if you haven't set this up before, create a virtual environment for this project (`$ virtualenv venv`)
- activate your virtualenv `$ source venv/bin/activate` (when you are finished using python, run `$ deactivate`)
- Open `py/pollCSVconverter.py`, replace `infile` and `outfile` (lines 7 and 8) and run the script ( `cmd` + `shift` + `r` from the open file in textmate, or from your console cd into the `py` directory and run `python3 pollCSVconverter.py`)
- Open `dist/poll.js` in a text editor.
    * Replace the URL on line 4 with your new data file
    * Update `labelArr` on line 15 with your spreadsheet's column headers; they MUST be in the same order as they appear in your CSV - all arrays are loaded by index so if your column name is in the wrong spot it will display the wrong data when the filter is clicked
- Check locally using `python -m simpleHTTPServer` (then open your browser to localhost:8000/dist/)
    * Read through the questions and answers and double-check that there are no strange characters, typos or proper nouns that should have been capitalized (the data comes to Isaac in ALL CAPS and I think he retypes them by hand). If you find odd characters you may wish to add them to the list of replacements in  `py/pollCSVconverter.py` on line 36 and/or 41 as appropriate.
- Upload to AWS and make public (see instructions [here](https://bitbucket.org/ajcnewsapp/news-apps-team-wiki/wiki/Setting%20up%20deployment%20credentials%20for%20our%20ajcnewsapp%20AWS%20s3%20account) if you don't have your credentials set up): `aws s3 cp ./dist s3://ajcnewsapps/[year]/polls/[your-poll] --recursive --acl public-read`
- Isaac usually creates the flatpage in Arc and we just need to add the embed code. Your embed code will look like this (see dist/iframe.html to preview it): 
```
      <div data-pym-src="https://ajcnewsapps.s3.amazonaws.com/[year]/polls/[your-poll]/index.html" id="poll-graphic"></div>
      <script type="text/javascript" src="https://pym.nprapps.org/pym-loader.v1.min.js"></script>
```


#### Troubleshooting
- The demographic group title cells often have a few leading spaces, which will break python parser if not accounted for (when specifying column name dict lookups)

- Assumes response totals are in same row as response labels and that following row is the pct representation

- The parser replaces "*", "-" and "" with "0" because those characters were breaking stuff, and if the value is 0 that label won't show up anyway (because it won't have a pixel width, not because it's not added to the DOM, fix that maybe). I believe there are checks in the code to get rid of them but it was still breaking. The polling company uses those symbols to mean either 0 or not a large enough sample.


### To do probably never
- jQuery library is outdated but broke stuff when I tried to update it (I think it's because qTip needs to be upgraded). jQuery UI library is current (as of 9/20/13)
- get rid of qTips
- filter with drop down instead of the pill buttons (allows for more filters)
- Add a way to compare historical responses to same question (Susan's request)
- Add answer base? eg. Likely voters vs undecided etc
- Better capitalization script - should automatically capitalize 1st char in cell and 1st char after ". ". Maybe even fix common words like Georgia, Congress, U.S., Senate, America, Obama etc.
- Build an editor to allow color selection - sometimes you want the color to mean something and this does them in order
- Is there a fix for the awkward text wrapping? Maybe truncate with "..."?
- This method publishes all of the polls to your new bucket every time you run the command. It's not hurting anything but unnecessary
