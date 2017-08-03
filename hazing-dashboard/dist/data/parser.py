# Parses sports.csv into sports.json
# There was probably a more efficient way to do this, but if it works it works amirite

import csv
import json

with open('dist/data/sports.csv') as csvfile:
    reader = csv.DictReader(csvfile)

    # creates a dict for each column/field that we want to record data for
    colE = {}
    colF = {}
    colH = {}
    colI = {}
    colJ = {}
    colK = {}
    colL = {}

    # creates a list (i'm sorry i called it a dict) for the answers to go in
    colE_dict = []
    colF_dict = []
    colH_dict = []
    colI_dict = []
    colJ_dict = []
    colK_dict = []
    colL_dict = []

    # each answer is now a dict with a unique ID and the answer itself
    colE_answer = {}
    colF_answer = {}
    colI_answer = {}
    colJ_answer = {}
    colK_answer = {}
    colM_answer = {}

    # starts the count of unique_id, it iterates at the end of the for loop
    unique_id = 0

    for row in reader:
        # parses column K so null responses have a value
        def parse_colK(row):
            if row == "":
                return "Did not respond"
            else:
                return row

        # parses column L so null responses have a value and changes other responses to Y or N
        def parse_colL(record):
            if record == "" or record == " O":
                return "Did not respond"
            if "no" in record.lower() or "never" in record.lower():
                return "N"
            else:
                return "Y"

        # establishes all the answer dicts
        colE_answer = {
            "ID": unique_id,
            "answer": row['How long have you been a high school coach?']
        }
        colE_dict.append(colE_answer)

        colF_answer = {
            "ID": unique_id,
            "answer": row['Have you ever witnessed or heard about hazing at a high school you have worked at?'],
            "experience": row['How long have you been a high school coach?']
        }
        colF_dict.append(colF_answer)

        colI_answer = {
            "ID": unique_id,
            "answer": row['Have you ever seen hazing turn into something worse, like bullying or abuse?'],
            "experience": row['How long have you been a high school coach?']
        }
        colI_dict.append(colI_answer)

        colJ_answer = {
            "ID": unique_id,
            "answer": row['In what sports have you seen or heard about hazing occurring? (Please check all that apply)'],
            "experience": row['How long have you been a high school coach?']
        }
        colJ_dict.append(colJ_answer)

        colK_answer = {
            "ID": unique_id,
            "answer": parse_colK(row['Do you think more needs to be done about preventing the negative consequences from hazing?']),
            "experience": row['How long have you been a high school coach?']
        }
        colK_dict.append(colK_answer)

        colL_answer = {
            "ID": unique_id,
            "answer": parse_colL(row['Were you ever involved in hazing or bullying as an athlete? Were you ever hazed or bullied? If so, can you offer details?']),
            "experience": row['How long have you been a high school coach?']
        }
        colL_dict.append(colL_answer)


        # writes all the column dicts
        colE = {
        "question": "How long have you been a high school coach?",
        "answers": colE_dict
        }

        colF = {
        "question": "Have you ever witnessed or heard about hazing at a high school you have worked at?",
        "answers": colF_dict
        }

        colI = {
        "question": "Have you ever seen hazing turn into something worse, like bullying or abuse?",
        "answers": colI_dict
        }

        colJ = {
        "question": "In what sports have you seen or heard about hazing occurring? (Please check all that apply)",
        "answers": colJ_dict
        }

        colK = {
        "question": "Do you think more needs to be done about preventing the negative consequences from hazing?",
        "answers": colK_dict
        }

        colL = {
        "question": "Were you ever involved in hazing or bullying as an athlete? Were you ever hazed or bullied? If so, can you offer details?",
        "answers": colL_dict
        }

        unique_id += 1

# writes it all out to the good ole json file
output = []
output.append(colE)
output.append(colF)
output.append(colI)
output.append(colJ)
output.append(colK)
output.append(colL)
jsonfile = open('dist/data/sports.json', 'w')
out = json.dumps(output)
jsonfile.write(out)
