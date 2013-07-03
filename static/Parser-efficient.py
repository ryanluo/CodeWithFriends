import urllib3
from bs4 import BeautifulSoup
from pymongo import MongoClient
import re

conn = urllib3.connection_from_url("http://aspc.pomona.edu/courses/browse/")
r1 = conn.request("GET", "http://aspc.pomona.edu/courses/browse/")
soup = BeautifulSoup(r1.data)
soup.prettify()
items = soup.findAll("span", {"class" : "dept_code"})
#
#for courses in items:
#        #  print str(courses.contents)
#          print courses.string


client = MongoClient()
db = client.db
course_col = db.course_col


string = []
major = []
soup2 = []
for x in range(0,(len(items))):
          string.append("http://aspc.pomona.edu/courses/browse/" + str(items[x].getText()))
          major.append(conn.request("GET", string[x]))
          soup2.append(BeautifulSoup(major[x].data))
          
          

courses = []
description = []
profs = []
time = []
for classes in soup2:
        ol = classes.find("ol",  {"class" : "course_list content"})
        li1 = ol.findAll("li", {"class" : re.compile(r"^(odd|even)$")})
        for li in li1:
          

          courselist = li.find("h3")
          professor = li.find("h4")
          desc = li.find("p")
          date = li.find("li", {"class" : "meeting"})

          
          
          if date == None:
             time.append("")
          else:
            
            time.append(date.getText()) 
         
          if courselist == None:
            courses.append("")
          else:

         		courses.append(courselist.getText())

         
          if professor == None:
            profs.append("")
          else:
          
            profs.append(professor.getText())
          	
          
          if desc == None:
            description.append("")
          else:
            
          	description.append(desc.getText())

dept = []
#This is the unicode shit that i was stuck on
#for i in range(0, len(courses) - 1):
#  print courses[i]
majors = []
number = []
schools = []
names = []
def school(course):
  if "PO-" in course:
      return "PO"
  elif "SC-" in course:
      return "SC"
  elif "PZ-" in course:
      return "PZ"
  elif "CM-" in course:
      return "CMC"
  elif "HM-" in course:
      return "HMC"

def newname(course):
    if course.find("-0") > 0:
        return course[(course.find("-0") + 5):]
    elif course.find("-1") > 0:
       return course[(course.find("-0") + 5):]

for i in range(len (courses)):
  if "PE" in (courses[i][:4]):
    majors.append("PE")
    number.append(courses[i][4:7])
    schools.append(school(courses[i]))
    names.append(newname(courses[i]))
  else:
    majors.append(courses[i][:4])
    number.append(courses[i][4:7])
    schools.append(school(courses[i]))
    names.append(newname(courses[i]))


          # "teacher" : profs[i][0:(profs[i].find("credit")-3)],

for i in range(0, len(courses)):
  course = {'coursename': courses[i],
            "name" : names[i],
            'major': majors[i],
          'number' : int(number[i]),            
          'profs': profs[i],
          "teacher" : profs[i][0:(profs[i].find("credit")-3)],
          "school" : schools[i],
          'description': description[i],
          'time': time[i]}
  course_col.insert(course)
			          