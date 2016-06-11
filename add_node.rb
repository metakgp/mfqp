#!/usr/bin/env ruby

require 'json'
require 'date'

if ARGV.length == 1 && ARGV[0] == "pretty"
	pretty = true
	ARGV.clear
end

fileData = File.read("data.json")
obj = JSON.parse(fileData)

# Initialise time periods.Dates have the format of yyyy-mm-dd
this_year = Date.today.strftime("%Y")
MID_SPRING_PERIOD = ["#{this_year}-02-15","#{this_year}-04-30"]
END_SPRING_PERIOD = ["#{this_year}-05-01","#{this_year}-09-30"]
MID_AUTUMN_PERIOD = ["#{this_year}-10-01","#{this_year}-11-30"]
END_AUTUMN_PERIOD = ["#{this_year}-12-01","#{(this_year.to_i+1).to_s}-02-14"]

puts "#{obj.length} objects earlier!"

# Just make sure that batch is not "" as while loop will never execute
batch = "h"
batch_semester = ""
batch_year = ""
today = Date.today.to_s

while !["y","Y","n","N"].include? batch
	puts "Do you want to batch insert year & semester for the papers? [y/Y for Yes, n/N for No) "
	batch = gets.chomp
	if batch.downcase == "y"
		puts "Enter batch semester : "
		batch_semester = gets.chomp
		puts "Enter batch year : "
		batch_year = gets.chomp
	elsif batch.downcase == "n"
		puts "Batch insert is not chosen."
	else
		puts "Invalid choice chosen - Use only y/Y/n/N"
		batch = "h"
	end
end

while true
	puts "Enter yet another paper? (press enter to continue, N/n to exit and write to file)"
	choice = gets.chomp

	if choice.length != 0 && choice.downcase == "n"
		break
	end

	puts "Enter the particulars of the new paper:"

	puts "Enter department: "
	department = gets.chomp

	if batch_semester.empty?
		puts "Enter semester (mid spring 2016): "
		semester = gets.chomp
	else
		semester = batch_semester
	end

	puts "Enter name of the paper (Basic Electronics): "
	paper = gets.chomp

	puts "Enter link to the paper: "
	link = gets.chomp

	if batch_year.empty?
		puts "Enter the year that this paper belongs to (2016): "
		year = gets.chomp
	else
		year = batch_year
	end	

	if year.length == 0
		year = this_year
	end

	if semester.length == 0
		if today >= MID_SPRING_PERIOD[0] && today <= MID_SPRING_PERIOD[1]
			semester = "mid spring "+this_year
		elsif today >= END_SPRING_PERIOD[0] && today <= END_SPRING_PERIOD[1]
			semester = "end spring "+this_year
		elsif today >= MID_AUTUMN_PERIOD[0] && today <= MID_AUTUMN_PERIOD[1]
			semester = "mid autumn "+this_year
		elsif today >= END_AUTUMN_PERIOD[0]	&& today <= END_AUTUMN_PERIOD[1]
			semester = "end autumn "+this_year
		else
			puts "Time period initialisation seems wrong."
			break	 
		end
	end

	paperObj = { "Department" => department, "Semester" => semester, "Paper" => paper, "Link" => link, "Year" => year }

	obj.push(paperObj)

end

puts "#{obj.length} papers now."
File.delete("data.json")

if pretty
	File.open("data.json", "w") { |file| file.write(JSON.pretty_generate(obj)) }
else
	File.open("data.json", "w") { |file| file.write(JSON.generate(obj)) }
end
