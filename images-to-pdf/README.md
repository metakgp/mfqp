DESCRIPTION
-----------
Given a directory with the Question Paper images , this script will convert all of them into PDFs - regardless of whether Question Papers (QPs) are single-page or multi-page. 

NAMING THE IMAGES
------------------
For single-page QPs , removal of hashes (m87sh6 here) is not compulsary. <br>For example , <pre>mid-spring-2016-MA20104-m87sh6.jpg (or) mid-spring-2016-MA20104.jpg</pre> is fine.
<br><br>
For QPs with multiple images , images need to be named as per their order (alphabetically). <br>For example , images can be named like <pre>mid-spring-2016-MA20104-1 , mid-spring-2016-MA20104-2</pre>. <br>Removal of hashes is compulsary , else the pages of the QP may not be in the correct order in the PDF.
<br><br>
The resultant PDFs will be named as mid-spring-2016-MA20104.pdf
<br><br><h3>NOTE</h3>The naming syntax of <pre>{mid/end}-{spring/autumn}-{year}-{subject_code}-{page_number/hash}</pre> must be strictly followed.

INSTALLATION STEPS
------------------
(Tested on Ruby 2.3.1)

Run these 2 commands (in the given order) in the terminal for the installation of the required GEM files.

<pre> (1) sudo apt-get install libmagickwand-dev </pre>
<pre> (2) gem install rmagick </pre>
All set!

EXECUTING THE SCRIPT
--------------------

Type the following commands in your terminal :
<pre>cd path-to-image-to-pdf-repository</pre>
<pre>ruby images-to-pdf.rb /home/user/path/to/QP/images/directory</pre>
Bugs & Bug-fixes are always appreciated! 
