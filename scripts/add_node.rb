#!/usr/bin/env ruby

require 'json'
require 'date'

# Initialise time periods.Dates have the format of yyyy-mm-dd
this_year = Date.today.strftime("%Y")
MID_SPRING_PERIOD = ["#{this_year}-02-15","#{this_year}-04-30"]
END_SPRING_PERIOD = ["#{this_year}-05-01","#{this_year}-09-30"]
MID_AUTUMN_PERIOD = ["#{this_year}-10-01","#{this_year}-11-30"]
END_AUTUMN_PERIOD = ["#{this_year}-12-01","#{(this_year.to_i+1).to_s}-02-14"]

# Regex check if given semester is valid
def semester_exists semester
  /(mid|end) (spring|autumn) (20)([0-9]{2})/.match(semester)
end	

# Find default semester for Today
def default today
  this_year = Date.today.strftime("%Y")
  return "mid spring "+this_year if today >= MID_SPRING_PERIOD[0] && today <= MID_SPRING_PERIOD[1]
  return "end spring "+this_year if today >= END_SPRING_PERIOD[0] && today <= END_SPRING_PERIOD[1]
  return "mid autumn "+this_year if today >= MID_AUTUMN_PERIOD[0] && today <= MID_AUTUMN_PERIOD[1]
  return "end autumn "+this_year if today >= END_AUTUMN_PERIOD[0] && today <= END_AUTUMN_PERIOD[1]
end

# Loops through collecting a batch_semester
def loop_batch default_semester
  batch, batch_semester = "", ""
  while !["y","Y","n","N"].include? batch
    puts "\n\nDo you want to batch insert year & semester for the papers? [y/Y for Yes, n/N for No) "
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
      batch_semester = nil
    else
      puts "Invalid choice chosen - Use only y/Y/n/N"
    end
  end
  return batch, batch_semester
end

# Loops through all papers, receiving input till a "N" / "n" is encountered
def loop_papers obj, batch, batch_semester, default_semester, testing
  while true
    puts "\n\nEnter yet another paper? (press enter to continue, N/n to exit and write to file)"
    choice = gets.chomp
    break if choice.length != 0 && choice.downcase == "n"
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
    paperObj = { Department: department, Semester: semester, Paper: paper, Link: link, Year: year }
    puts paperObj if testing
    obj.push(paperObj)
  end
  return obj
end

# Writes the given obj into filename (json file) with / without pretty-printing
def write_into_json filename, obj, pretty
  puts "#{obj.length} papers now."
  File.delete(filename) if File.exists? filename
  if pretty
    File.open(filename, "w") { |file| file.write(JSON.pretty_generate(obj)) }
  else
    File.open(filename, "w") { |file| file.write(JSON.generate(obj)) }
  end
end

unless ARGV[0].nil?
  pretty = ARGV[0] == "pretty"
  testing = ARGV[0] == "testing"
  ARGV.clear
end

filename = "data/data.json"
default_semester = default(Date.today.to_s)
batch , batch_semester = loop_batch default_semester
obj = (File.exists? filename) ? JSON.parse(File.read(filename)) : []
puts "DEBUG: #{obj.length} before object addition!"
obj = loop_papers obj, batch, batch_semester, default_semester, testing
write_into_json filename, obj, pretty if not testing
