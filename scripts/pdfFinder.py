import argparse
from collections import deque, namedtuple
import json
import re
import requests
from urllib.parse import urlparse
from bs4 import BeautifulSoup

Node = namedtuple("Node", ["link", "parent", "grandparent"])

def pdf_bfs(start, exclude=[]):
    q = deque()
    q_node = deque()
    visited = {}
    visited_node = {}
    p = urlparse(start)
    baseurl = p.scheme + "://" + p.netloc
    if start[-4:] == ".pdf":
        print("Provide a non-pdf link to start with.")
        return start
    
    q.append(start)
    q_node.append(Node(start, None, None))

    while len(q) != 0:
        link = q.popleft()
        link_obj = q_node.popleft()
        print("Checking Link:", link)
        try:
            if "redlink=1" in link or link[0] == "#" or link.startswith("http://10."):
                raise IOError
            elif link[0] == "/":
                print(baseurl + link)
                html = requests.get(baseurl + link).text
            else:
                html = requests.get(link).text
            soup = BeautifulSoup(html, 'html.parser')

            a = soup.find_all('a')
            print("Retrieved links")
            children = [b.get('href') 
            for b in a if b.text.lower() not in exclude
            and b.get('href') not in visited
            and baseurl + b.get('href') not in visited]

            for child in children:
                print("     ", child)
                if child[-4:] == ".pdf" and "images" in child:
                    visited[child] = "pdf"
                    visited_node[Node(child, link, link_obj.parent)] = "pdf"
                else:
                    q.append(child)
                    q_node.append(Node(child, link, link_obj.parent))
            
            visited[link] = "page"
            visited_node[link_obj] = "page"           
        except KeyboardInterrupt:
            break
        except:
            print("Found bad link")
            visited[link] = "bad"
            visited_node[link_obj] = "page"

    return visited_node

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("start_link", help="Url as the start point for searching")
    parser.add_argument("json_dump", help="Location of json file to write")
    args = parser.parse_args()
    
    #In case of further changes in the site structure:
    #All hardcoding is to be done this point onwards.
    #Or most probably in the if checking of Line 24
    
    EXCLUDE = [
        "click here for e-books",
        "search e-books click here",
        "main page",
        "recent changes",
        "random page",
        "help",
        "what links here",
        "related changes",
        "special pages",
        "printable version",
        "permanent link",
        "page information",
        '',
        'view history',
        'privacy policy',
        'log in',
        'discussion',
        'read',
        'view source',
        'disclaimers',
        'about previous year semester question papers',
        'http://10.18.24.7/pages/semquestionwiki/index.php?title=main_page&oldid=6099',
        '[1]',
        '[2]',
        "contribs",
        "talk",
        "cliitkgp",
        "file",
        "file history",
        "file usage"
    ]

    result = pdf_bfs(args.start_link, exclude=EXCLUDE)

    data = []
    uncategorized = []
    
    p = urlparse(args.start_link)
    baseurl = p.scheme + "://" + p.netloc

    filename_regex = r"[A-Z]{2}.+_[MS|ES|MA|EA]{2}_[0-9]{4}"
    matcher = re.compile(filename_regex)

    counter = 0    
    for key in result:
        if result[key] == "pdf":
            name = key.link.split("/")[-1][:-4]
            try:
                assert matcher.fullmatch(name)
                blocks = name.split("_")

                fileblock = {
                    "Department" : blocks[0][:2],
                    "Link" : baseurl + key.link,
                    "Paper" : " ".join(blocks[1: -2]),
                    "Semester" : blocks[-2],
                    "Year" : blocks[-1] 
                }

                data.append(fileblock)
            except:
                gp = key.grandparent.split("/")[-1]
                name = key.link.split("/")[-1][:-4]
                fileblock = {
                    "Department": gp.split("_")[0],
                    "Year": gp.split("_")[1],
                    "Paper": name,
                    "Semester": "",
                    "Link": baseurl + key.link
                }

                if "_MS_" in key.link:
                    fileblock['Semester'] = 'MS'
                elif "_ES_" in key.link:
                    fileblock['Semester'] = 'ES'
                elif "_MS_" in key.link:
                    fileblock['Semester'] = 'MS'
                elif "_EA_" in key.link:
                    fileblock['Semester'] = 'EA'

                uncategorized.append(fileblock)                    
            finally:
                counter += 1

    final_data = uncategorized[:]
    final_data.extend(data)

    fpath = open(args.json_dump, "a+")
    fpath.seek(0)
    if len(fpath.read()) == 0:
        json.dump(final_data, fpath, indent=1)
        fpath.close()
    else:
        fpath.seek(0)
        old_data = json.load(fpath)
        final_data.extend(old_data)

        fpath.close()

        fpath = open(args.json_dump, "w")
        json.dump(final_data, fpath, indent=1)
        fpath.close()

    print("Total entries in file =", len(final_data))        
