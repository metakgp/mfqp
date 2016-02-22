#!/usr/bin/env ruby

require 'json'

if ARGV.length == 1 && ARGV[0] == "pretty"
	pretty = true
	ARGV.clear
end

fileData = File.read("data.json")
obj = JSON.parse(fileData)

puts "#{obj.length} objects earlier!"

while true
	puts "Enter yet another paper? (press enter to continue, N/n to exit and write to file)"
	choice = gets.chomp

	if choice.length != 0 && choice.downcase == "n"
		break
	end

	puts "Enter the particulars of the new paper:"

	puts "Enter department: "
	department = gets.chomp

	puts "Enter semester (mid spring 2016): "
	semester = gets.chomp

	puts "Enter name of the paper (Basic Electronics): "
	paper = gets.chomp

	puts "Enter link to the paper: "
	link = gets.chomp

	puts "Enter the year that this paper belongs to (2016): "
	year = gets.chomp

	if year.length == 0
		year = "2016"
	end

	if semester.length == 0
		semester = "mid spring 2016" # TODO: make this automatic based on the present data
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
