
import os
import openai
from dotenv import load_dotenv, find_dotenv

load_dotenv()

# openai.api_type = "azure"
# openai.api_version = "2023-03-15-preview" 
# openai.api_base = "https://sbzdfopenai.openai.azure.com/" 
# openai.api_key = "9ac347d13e834f288a2076ff9c7b418a"

openai.api_type = os.environ.get("OPENAI_API_TYPE")
openai.api_version = os.environ.get("OPENAI_API_VERSION")
openai.api_base = os.environ.get("OPENAI_API_BASE")
openai.api_key = os.environ.get("OPENAI_API_KEY")

print(openai.api_type)
print(openai.api_version)
print(openai.api_base)
print(openai.api_key)

class chatGPT():
    def __init__(self):
        self.messages = [
                {"role": "system", "content": """Your name is Olga, you are a full stack developer reconverted to a HR specialist in recruiting for Continental Sibiu. Your job is to:
                - take a interview and put relevant questions to the candidate
                - screen candidates over the phone to identify their skill set 
                - test all the declared skills by placing some deep technical questions 
                - figure out the level of each skill

                

                in order to suggest the best fit according the open positions within the company.

                

                Your end-game is to tell the candidate the job position number on witch he fits best and ask him to apply on it.

                

                The positions are:
                1. Software developer: Mandatory skill: Javascript
                It will be nice to know also html and css, with some basic NodeJS skills and SQL again at basic level
                2. HR payroll: deals with salary and we are searching a candidate good with math and somebody with a character that inspire confidentiality.
                3. Software developer: Mandatory skill: Javascript
                It is important to also html and css, but less important to know NodeJS skills and SQL, maybe at a basic level."""},
            ]
    def answering(self):
        response = openai.ChatCompletion.create(
            engine="gpt35-uif54579",
            messages= self.messages
        )

        # print(response)

        return(response['choices'][0]['message']['content'])

    
    def add_chat_answer(self, chat_response):
        chat_response_obj = {
            "role": "system",
            "content": chat_response
        }
        self.messages.append(chat_response_obj)
        return self.messages

    def add_user_question(self, user_question):

        user_question_obj = {
            "role": "user",
            "content": user_question
        }

        self.messages.append(user_question_obj)

        return self.messages



# chat = chatGPT()

# while True:
#     user_question = input("Your question (press exit to stop the program): ")

#     if(user_question.lower() == "exit"):
#         break

#     user_question_obj = {
#         "role": "user",
#         "content": user_question
#     }

#     messages = chat.add_user_question(user_question_obj)

#     print(messages)

#     chat_response = chat.answering()

#     print(chat_response)

#     messages = chat.add_chat_answer(chat_response)

#     print(messages)
