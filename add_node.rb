#!/usr/bin/env ruby

require 'json'
require 'date'

# Initialise time periods.Dates have the format of yyyy-mm-dd
this_year = Date.today.strftime("%Y")
MID_SPRING_PERIOD = ["#{this_year}-02-15","#{this_year}-04-30"]
END_SPRING_PERIOD = ["#{this_year}-05-01","#{this_year}-09-30"]
MID_AUTUMN_PERIOD = ["#{this_year}-10-01","#{this_year}-11-30"]
END_AUTUMN_PERIOD = ["#{this_year}-12-01","#{(this_year.to_i+1).to_s}-02-14"]

def semester_exists semester
  possible_semesters = /(mid|end) (spring|autumn) (20)([0-9]{2})/
    if possible_semesters.match(semester)
      return true
    else
      return false
    end
end

def default today
  this_year = Date.today.strftime("%Y")
  if today >= MID_SPRING_PERIOD[0] && today <= MID_SPRING_PERIOD[1]
    return "mid spring "+this_year
  elsif today >= END_SPRING_PERIOD[0] && today <= END_SPRING_PERIOD[1]
    return "end spring "+this_year
  elsif today >= MID_AUTUMN_PERIOD[0] && today <= MID_AUTUMN_PERIOD[1]
    return "mid autumn "+this_year
  else today >= END_AUTUMN_PERIOD[0]	&& today <= END_AUTUMN_PERIOD[1]
    return "end autumn "+this_year
  end
end

if ARGV.length == 1 && ARGV[0] == "pretty"
  pretty = true
  ARGV.clear
end

if ARGV.length == 1 && ARGV[0] == "testing"
  testing = true
  ARGV.clear
end

obj = JSON.parse(File.read("resoures/data/data.json"))
puts "#{obj.length} objects earlier!"

# Find out default semester
default_semester = default(Date.today.to_s)
batch = ""
batch_semester = ""

while !["y","Y","n","N"].include? batch
  puts "Do you want to batch insert year & semester for the papers? [y/Y for Yes, n/N for No) "
  batch = gets.chomp
  if batch.downcase == "y"
    while !semester_exists(batch_semester)
      puts "Enter batch semester (#{default_semester}) : "
      batch_semester = gets.chomp
      if batch_semester.length == 0
        batch_semester = default_semester
        puts "Used default semester"
      end
    end
  elsif batch.downcase == "n"
    puts "Batch insert is not chosen."
  else
    puts "Invalid choice chosen - Use only y/Y/n/N"
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

  semester = ""

  if batch.downcase == "n"
    while !semester_exists(semester)
      puts "Enter semester (#{default_semester}) : "
      semester = gets.chomp
      if semester.length == 0
        semester = default_semester
        puts "Used default semester"
      end
    end
  else
    semester = batch_semester
  end

  puts "Enter name of the paper (Basic Electronics): "
  paper = gets.chomp

  puts "Enter link to the paper: "
  link = gets.chomp

  year = semester.split(" ")[2]

  paperObj = { "Department" => department, "Semester" => semester, "Paper" => paper, "Link" => link, "Year" => year }

  if testing
    puts paperObj
  end

  obj.push(paperObj)

end

if not testing
  puts "#{obj.length} papers now."
  File.delete("resources/data/data.json")
  if pretty
    File.open("resources/data/data.json", "w") { |file| file.write(JSON.pretty_generate(obj)) }
  else
    File.open("resources/data/data.json", "w") { |file| file.write(JSON.generate(obj)) }
  end
end
