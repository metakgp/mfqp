#Require this gawdly gem
require 'rmagick'

# Get images directory as argument from terminal
images_directory = ARGV[0]

# Get all files from that directory
all_images = Dir.entries(images_directory)

#Segregate only the required the question paper images , just in case the directory contains other files
all_images.keep_if { |a| ((a.start_with? "mid-") || (a.start_with? "end-")) && ((a.end_with? ".jpg") || (a.end_with? ".png") || (a.end_with? ".tif") || (a.end_with? ".gif") || (a.end_with? ".svg") || (a.end_with? ".bmp"))}

#Store number of images as a variable to show % finished
number_of_images = all_images.count

# Initialisation of variables like Array of names of papers , eg. mid-spring-2016-MA20104
papernames_array = []
i = 0
all_images = all_images.sort
stack = Magick::ImageList.new

#Loop through all paper images & batch merge them into PDFs , even if a paper has 3 pages / images
all_images.each do |file|
  papernames_array[i] = file[0..22]
  if i == 0
    stack = Magick::ImageList.new
    incoming = Magick::ImageList.new file
    stack.concat(incoming)
  else
    if papernames_array[i].eql? papernames_array[i-1]
      incoming = Magick::ImageList.new file
      stack.concat(incoming)
    else
      stack.write(papernames_array[i-1]+".pdf")
      stack = Magick::ImageList.new
      incoming = Magick::ImageList.new file
      stack.concat(incoming)
    end
    if i == number_of_images-1
      stack.write(papernames_array[i]+".pdf")
    end
  end
  i = i + 1
  percentage = (i.to_f/number_of_images.to_f) * 100
  puts "Processing #{i}/#{number_of_images} images , #{percentage}% done"
end
