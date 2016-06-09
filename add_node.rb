#!/usr/bin/env ruby

require 'json'
require 'date'

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
		year = Date.today.strftime("%Y")
	end

	if semester.length == 0
		last_sem = obj.last["Semester"]
		semester = "" 
		if last_sem.include? "mid"
			semester = last_sem.gsub("mid","end") 
		else
			semester = last_sem.gsub("end","mid")
			if last_sem.include? "spring"
				semester = semester.gsub("spring","autumn")
			else
				semester = semester.gsub("autumn","spring")
				semester = semester.gsub(last_sem.split(" ")[2],((last_sem.split(" ")[2].to_i)+1).to_s)
			end
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
