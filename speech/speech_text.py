
import os
import azure.cognitiveservices.speech as speechsdk
from dotenv import load_dotenv
load_dotenv()
import requests

from openAi import chatGPT
from text_speech import Voice

def sendUserMessage(userText):
    url = "http://localhost:5000/userMessage"
    message = {"message": userText}

    requests.post(url, json=message)


def sendBotMessage(botText):
    url = "http://localhost:5000/botMessage"
    message = {"message": botText}

    requests.post(url, json=message)



def speech_recognize_once_with_auto_language_detection_from_mic():
    chatgpt = chatGPT()
    voice =  Voice()

    """performs one-shot speech recognition from the default microphone with auto language detection"""
    speech_config = speechsdk.SpeechConfig(subscription=os.environ.get('SPEECH_KEY'), region=os.environ.get('SPEECH_REGION'))

    # create the auto detection language configuration with the potential source language candidates
    auto_detect_source_language_config = \
        speechsdk.languageconfig.AutoDetectSourceLanguageConfig(languages=["en-US"])
    speech_recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config, auto_detect_source_language_config=auto_detect_source_language_config)
    result = speech_recognizer.recognize_once()

    # Check the result
    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        auto_detect_source_language_result = speechsdk.AutoDetectSourceLanguageResult(result)
        print("Recognized: {} in language {}".format(result.text, auto_detect_source_language_result.language))
        # prompt = """Esti un asistent,rolul tau este de a raspunde la intrebari userului si sa returnezi un json pe limba: """ + auto_detect_source_language_result.language + """.  
        # Ai urmatoarele informatii despre urmatoarele persoane: Alex are 20 ani, locuiesti in Sibiu si ii place sa calatoreasca.
        # Returneaza-mi un singur raspuns sub forma de JSON. Exemplu de raspuns in JSON: {
        #             "question":"Ce știi despre Alex?",
        #             "answer":"Alex are 20 ani, locuieste in Sibiu si ii place sa calatoreasca"
        # };"""
        
        # print(prompt)
        print(result.text)
        language = auto_detect_source_language_result.language
        voice_language = ""
        if(language == "ro-RO"):
            voice_language = "ro-RO-AlinaNeural"
        elif(language == "en-US"):
            voice_language = "en-US-JennyNeural"
        elif(language == "pt-PT"):
            voice_language = "pt-PT-RaquelNeural"
        elif(language == "es-ES"):
            voice_language = "es-ES-ElviraNeural"

        sendUserMessage(result.text)
        chat_response = chatgpt.model_response(result.text, language)
        print(f"Model's answer: {chat_response['choices'][0]['text']}")
        sendBotMessage(chat_response['choices'][0]['text'])
        voice.text_to_speech(chat_response['choices'][0]['text'], voice_language)

    elif result.reason == speechsdk.ResultReason.NoMatch:
        print("No speech could be recognized")
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print("Speech Recognition canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            print("Error details: {}".format(cancellation_details.error_details))


# chatgpt = ChatGPT()

while True:
    speech_recognize_once_with_auto_language_detection_from_mic()