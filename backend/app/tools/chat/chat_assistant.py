###############################################################
######################### IMPORTS #############################
###############################################################
from openai import OpenAI
from dotenv import load_dotenv,dotenv_values, set_key

import os
import time
import logging
from datetime import datetime

# OPENAI_ASSISTANT_ID = os.environ.get('OPENAI_ASSISTANT_ID')

class Chat_assistant:
    """
    Chat assistant class that interacts with the OpenAI API.

    Attributes:
    - client: The OpenAI client object.
    - assistant: The OpenAI assistant object.
    - model: The model to use for the assistant.
    - thread: The thread object for the assistant.
    - run: The run object for the assistant.
    - assistant_id: The ID of the assistant.
    
    Methods:
    - set_new_thread: Creates a new thread for the assistant.
    - get_response_from_user_message: Gets a response from the assistant based on a user message.
    - _wait_for_run_completion: Helper function; waits for a run to complete and prints the elapsed time.
    """
    load_dotenv()
    config = dotenv_values(".env")

    def __init__(self, assistant_id,
                 setup_instructions,
                 model,
                 name):
        """
        Constructor for a new chat assistant.
        """
        self.client = OpenAI()
        # instantiates a new assistant if one doesn't already exist
        if assistant_id:
            self.assistant_id = assistant_id
            self.assistant = self.client.beta.assistants.retrieve(assistant_id)
            return
        else:    
            self.model = model
            self.assistant = self.client.beta.assistants.create(
                name=name,
                instructions=setup_instructions,#TODO: insert role instructions & pre-chat prompts 
                tools=[{"type": "code_interpreter"}],#{"type": "function"}
                model=self.model,
            )
            
            # obtain most recently created assistant an set env that env variable
            assistants = self.client.beta.assistants.list(order='desc')
            if assistants.data:
                self.assistant_id = assistants.data[0].id
            else:
                raise Exception("Error: No assistants found after instantiation. Ensure you have an OpenAI API key.")

            set_key(f"{os.getcwd()}/.env", key_to_set="OPENAI_ASSISTANT_ID", value_to_set=self.assistant_id)

    def set_new_thread(self):
        """
        Creates a new thread for the assistant.
        """
        self.thread = self.client.beta.threads.create()


    def get_response_from_user_message(self,user_chat_message:str,additional_instructions=None,max_completion_tokens=180)->str:
        """
        Gets a response from the assistant based on a user message.
        
        :param user_chat_message: The user message.
        :param additional_instructions: Any additional instructions for the assistant.
        :param max_completion_tokens: Maximum number of tokens for the completion.
        :return: The response from the assistant as a string.
        """

        if user_chat_message is None:
            user_chat_message = ""
        if additional_instructions is None:
            additional_instructions = ""
        
        content = additional_instructions+"\n"+user_chat_message
        message = self.client.beta.threads.messages.create(self.thread.id, role="user", content=content)

        self.run = self.client.beta.threads.runs.create(
            thread_id=self.thread.id,
            assistant_id=self.assistant.id,
            # max_completion_tokens=max_completion_tokens
            # additional_instructions=additional_instructions,
        )
        
        return self._wait_for_run_completion(self.run.id)

    def _wait_for_run_completion(self,run_id, sleep_interval=5)->str:
        """
        Helper function; waits for a run to complete and prints the elapsed time.
        
        :param run_id: The ID of the run.
        :param sleep_interval: Time in seconds to wait between checks.
        :return: The response from the assistant as a string.
        """
        while True:
            try:
                run = self.client.beta.threads.runs.retrieve(thread_id=self.thread.id, run_id=run_id)
                if run.completed_at:
                    elapsed_time = run.completed_at - run.created_at
                    formatted_elapsed_time = time.strftime(
                        "%H:%M:%S", time.gmtime(elapsed_time)
                    )
                    print(f"Run completed in {formatted_elapsed_time}")
                    logging.info(f"Run completed in {formatted_elapsed_time}")
                    # Get messages here once Run is completed
                    messages = self.client.beta.threads.messages.list(thread_id=self.thread.id)
                    last_message = messages.data[0]
                    response = last_message.content[0].text.value
                    return response
                
            except Exception as e:
                logging.error(f"An error occurred while retrieving the run: {e}")
                break
            print("Waiting for openAI API response for assistant chat...")
            time.sleep(sleep_interval)

