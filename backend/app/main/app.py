###############################################################
######################### IMPORTS #############################
###############################################################

from flask import Flask, Blueprint,jsonify, send_file
from flask_socketio import SocketIO, send, emit
from flask import request
from app.tools.log import Log
from flask_cors import CORS
import os
import time
import pandas as pd

# custom imports
from app.tools.causal_network.network_pyagrum import CausalNetwork
from app.tools.chat.chat_assistant import Chat_assistant
from app.tools.chat.format_prompt import build_prompt_str, INITIAL_PROMPT

###############################################################
######################## APP SETUP ############################
###############################################################
cwd = os.getcwd()
main = Blueprint('main', __name__)
socketio = SocketIO(cors_allowed_origins="*")

log = Log()
time_of_logger_instantiation= str(time.time()).split(".")[0]
chat_history_logger_file_path = f"{os.getcwd()}/chat_histories/chat_at_{time_of_logger_instantiation}.txt"
chat_history_logger = Log(chat_history_logger_file_path)
chat_history_logger.activate()

def create_app():
    app = Flask(__name__)
    app.register_blueprint(main)
    socketio.init_app(app)
    CORS(app)
    
    return app

#################### CAUSAL NETWORK ###########################
###############################################################
# uncomment lines below for student grades toy network
# cn = CausalNetwork(data_path = f"{cwd}/toy_datasets/student_grades_toy.csv",
#                    structure_path =f'{cwd}/toy_datasets/student_toy_graph.bif')

# uncomment lines below for asia network
cn = CausalNetwork(data_path = f"{cwd}/toy_datasets/sample_asia.csv",
                   structure_path =f'{cwd}/toy_datasets/asia.bif')

#################### CHAT ASSISTANT ###########################
###############################################################
open_ai_assistant_id_env_var_name = "OPENAI_ASSISTANT_ID"
open_ai_assistant_id = os.getenv(open_ai_assistant_id_env_var_name, None)

try:
    print(f"Setting up with assistant: {open_ai_assistant_id}")
    chat_assistant = Chat_assistant(open_ai_assistant_id,None,None,None)
except Exception as e:
    print(f"Exception: {e}")
    print(f"Unable to locate chatbot with id: {open_ai_assistant_id}. Instantiating new chatbot. Go to https://platform.openai.com/assistants to view assistant id and save to OPENAI_ASSISTANT_ID environment variables if not already populated.")
    # INITIAL_PROMPT["Initial adjacency matrix"] = cn.get_network_adjacency_matrix_str()

    setup_instructions = build_prompt_str(INITIAL_PROMPT)
    model = "gpt-4-turbo"
    try:
        chat_assistant = Chat_assistant(assistant_id=None,setup_instructions=setup_instructions,model= model,name= "Causal Network Assistant")
    except Exception as e:
        print(f"Error in creating chat assistant. Ensure you have an openAI API key: {e}")

###############################################################
########################## ROUTES #############################
###############################################################

@main.route('/')
def home():
    """
    Fetch the home page, simply a welcome message to test server connection.

    Args:
        None

    Returns:
        response (json): A JSON object containing a hello message.
    """
    res = {'data': 'Hello, causal chat user!'}
    return jsonify(res)

@main.route('/network', methods=['GET','PUT'])
def network():
    """
    Fetch or update the network graph.

    Args:
        format (str): The format of the network graph to return.

    Returns:
        response (json): A JSON object containing network graph data. Default and sole current available is cytoscape element format.
    """
    if request.method == 'PUT':
            return update_network()
    
    # default to cytoscape format if no query param provided
    response_format = request.args.get('format', 'cytoscape').lower()
    if response_format == 'cytoscape':
            res = cn.get_network_cytoscape_elements()
            return jsonify(res), 200
    else:
        # res = cn.get_network_json_elements() # currently not supported
        res = {"message":"Network format not supported"}
        return jsonify(res), 200

def update_network():
    '''
    Updates the network graph.

    Args:
        changes (str): changes (edge addition or deletion) to be made to graph structure

    Returns:
        response (json): A message indicating success of network update

    ex. request body:
        {
            "changes": [
                        {'deletion': 
                            {'data': {'id': 'smoking->lung_cancer', 'source': 'smoking', 'target': 'lung_cancer'}}},
                        {'addition': 
                            {'data': {'id': 'smoking->visit_to_Asia', 'source': 'smoking', 'target': 'visit_to_Asia'}}}
                    ]
        }
    '''
    req_body = request.get_json()

    changes = req_body['changes']
    print(f"Attempting to make the following changes to network:\n{changes}\n")
    try:
        cn.update_network(changes)
        print(f"Successfully made changes to network")
    except Exception as e:
        print(f"Error when attempting to make changes to network: {e}")
    
    for change in changes:
        try:
            deletion = change['deletion']
            msg = f"Deleted edge: {deletion['data']['source']} -> {deletion['data']['target']}"
            log.log_item(msg)
        except KeyError as ke:
            addition = change['addition']
            msg = f"Added edge: {addition['data']['source']} -> {addition['data']['target']}"
            log.log_item(msg)
        except Exception as e:
            print(f"Error when logging change:{e}")

    res = {"message":"Network updated :)"}
    return jsonify(res), 200

@main.route('/network/data', methods=['GET'])
def get_network_data():
    """
    Fetch the network graph.

    Args:
        unique_values (str): If provided, will return the potential values for each variable in the network.

    Returns:
        response (json): A JSON object containing network graph data. Default and sole current available is cytoscape element format.
    """
    filter = request.args.get('filter', None)
    unique_values = request.args.get('unique_values', None)
    if filter:
        filter = filter.split(',')
    df = cn.get_network_df(cols=filter)
    
    if unique_values:
        # threshold = 3
        # res = [{col:list(df[col].unique())} for col in df.columns[:threshold]]
        res = [{col:list(df[col].unique())} for col in df.columns] #<-- this is the correct implementation
        return jsonify(res), 200
    
    return jsonify(df.to_dict()), 200

@main.route('/network/learn', methods=['PUT'])
def learn_network():
    """
    Placeholder for algorithmically learning the network structure.

    NOTE: not currently implemented
        - TODO: 
            - implement learn network function in tools.causal_network.network_pyagrum.py
            - parse body to obtain added assumptions and insert assumptions in to network

    Args:
        assumptions (list[str]): Assumptions to restrict learning algorithm.

    Returns:
        response (json): A placeholder JSON response.
    """
    req_body = request.get_json()
    res = cn.get_network_cytoscape_elements()
    return jsonify(res), 200

@main.route('/network/estimate_effect', methods=['GET'])
def estimate_effect():
    """
    Fetch a causal estimate.

    Args:
        treatment (str): the "do" variable and value -- expects treatment query param in format of <treatment~value> (ex. petrissage_lissage~aVI_I_FI)
        outcome (str): the outcome variable (ex. petrissage_collantDeLaPate)

    Returns:
        response (json): A JSON object containing a string for a pyAgrum.Potential object and an explanation of the estimate.
    
    """
    try:
        if '~' in request.args.get('treatment'):
            treatment, treatment_val = request.args.get('treatment').split('~')
        else:
            treatment, treatment_val = request.args.get('treatment'), None
        outcome = request.args.get('outcome')

        if treatment_val:
            values = {treatment: treatment_val}
        else:
            values = None
        estimate, explanation, formula = cn.get_causal_estimate(outcome, treatment, knowing=None, values=values)

        # convert estimate to dataframe for better formatting
        estimate_df = pd.DataFrame(estimate)

        if estimate_df.isnull().values.any():
            raise Exception("Found NaN in estimate")
        
        log_message = f"Estimated causal effect on Y={outcome} when doing X=({treatment}={treatment_val}). Result:\n{estimate_df.to_markdown(tablefmt='grid')}\n\n{explanation}\nFormula:{formula}\n"
        log.log_item(log_message)
        print("Briggs: 123",estimate_df)
        res = {"causal_estimate":estimate_df.to_dict(),"explanation":explanation, "formula":formula}
        
        return jsonify(res), 200
    except Exception as e:
        print("Error while estimating effect",e)
        res = {"error":f'expects query params in format of treatment~value, outcome~value; {str(e)}'}
        return jsonify(res), 200

@main.route('/network/markov_blanket', methods=['GET'])
def get_markov_blanket():
    """
    Fetch the Markov blanket for a target variable.

    Args:
        target (str): the variable for which a Markov blanket will be returned

    Returns:
        response (json): A JSON object containing the Markov blanket of the target variable.
    """
    try:
        target = request.args.get('target')
        print("target = ",target)
        mb = cn.get_markov_blanket(target)
        mb.remove(target)#removes self from mb
        log_message = f"{mb} are in the markov blanket of the {target} variable."
        log.log_item(log_message)
        
        res = {"markovBlanket":{target:mb}}
        
        return jsonify(res), 200
    except Exception as e:
        print("Error while getting markov blanket",e)
        res = {"error":f'expects query param for target; {str(e)}'}
        return jsonify(res), 200

@main.route('/network/test_independence', methods=['GET'])
def test_independence():
    """
    Return the conditional independence test for all pairs of independent nodes in the graph.

    Returns:
        response (json): A JSON object containing independence assumption, conditioning set, and the p-value for the set of independence assumptions in the causal model
    """
    # currently unused in frontend -- i.e. always returns all independence assumptions
    if request.args:
        target = request.args.get('target')
    else:
        target = None
    
    independence_test_dict = cn.get_independence_test_dict(target)
    
    formatted_data = [
        {"independence_assumption": [key[0], key[1]], 
         "conditioning_set":list(key[2]),
         "value": value}
        for key, value in independence_test_dict.items()
    ]

    res = {"independence_test_dict":formatted_data}
    return jsonify(res), 200


@main.route('/network/test_independence/log', methods=['PUT'])
def log_independence():
    req_body = request.get_json()
    if req_body:
        independence_test = req_body['target']
        if log.active:
            independence_assumption = " and ".join(independence_test['independenceAssumption'])
            if independence_test['conditionalVariables']:
                conditional_variables = independence_test['conditionalVariables']
            else:
                conditional_variables = "no variables"
            p_value = independence_test['pValue']
            log_message  = f"The assumption that the variables {independence_assumption} are independent when conditioned on {str(conditional_variables)} has a p-value of {p_value}."
            log.log_item(log_message)
            return jsonify({"success":"logging target independence test"}), 200
        else:
            return jsonify({"NA":"logging inactive; independence assumption not logged"}), 200
    else:
        return jsonify({"error":"requires target independence test"}), 400


@main.route('/track_actions', methods=['PUT'])
def track_actions():
    """
    Triggers the logging of user actions.

    Returns:
        response (json): A JSON object containing a string showing message for status of logging.
    
    """
    req_body = request.get_json()
    tracking = req_body['is_tracking']
    if tracking:
        log.activate()
        print("LOGGING ACTIVATED...")
        res = {"message":f"Beginning to track actions ..."}
    else:
        # log.write_logs_to_file()
        print("LOGGING DEACTIVATED...")
        log.deactivate()
        log.flush()
    res = {"message":f"No longer tracking actions."}
    return jsonify(res), 200

@main.route('/chat_history', methods=['GET'])
def get_chat_history():
    try:
        return send_file(chat_history_logger_file_path, as_attachment=True)
    except Exception as e:
        msg = f"Error in sending chat_history:{e}"
        print(msg)
        return jsonify({"error":msg})

@main.after_request
def auto_submit_interations_to_chat(response):
    """
    Automatically submits interaction history to chat when a threshold is reached.
    """
    auto_submit_threshold = 2
    try:
        if request.endpoint in ['main.get_markov_blanket','main.estimate_effect']\
            and request.method == 'GET' and log.active\
            or (request.method == 'PUT' and request.endpoint in ['main.log_independence','main.network']):
            if len(log.log) >= auto_submit_threshold:
                print(f'Auto submitting interaction history because threshold of {auto_submit_threshold} interactions reached.')
                handle_user_message({"message": "", "sendUserActions": True})
    except Exception as e:
        print(f"Error in auto_submit_interations_to_chat: {e}")
    # You can also modify the response if needed
    return response

###############################################################
######################## SOCKET IO ############################
###############################################################
@socketio.on('connect')
def test_connect():
    """
    Establishes a socket connection with the client and sets a chat assistant thread.
    """
    try:
        chat_assistant.set_new_thread()
        socketio.emit('my response', {'data': 'You\'ve connected to the chat'})
    except Exception as e:
        socketio.emit('my response', {'data': f'Error in creating thread:{e}'})
    

@socketio.on('user_message')
def handle_user_message(json):
    """
    Handles user messages and sends responses via socket connection.
    Expects json blob with message and sendUserActions key -- ex. {"message":"hello,"sendUserActions":true}
    """
    try:
        user_chat_message = json.get('message')
        send_user_actions = json.get('sendUserActions',False)
        
        if send_user_actions and log.active and len(log.log) > 0:
            user_action_history_list = log.get_log_and_flush()
            user_action_history_str = ""
            for i,action in enumerate(user_action_history_list):
                user_action_history_str += f"{i+1}){action}\n"
            additional_instructions = build_prompt_str({"user action history:":user_action_history_str})
        else:
            additional_instructions = None
        
        if user_chat_message:
            user_chat_message = build_prompt_str({"User":user_chat_message})
        
        # NOTE: comment out the lines below to prevent calling the openAI API -- WARNING -- this API call incurs charges with each message sent
        print("WARNING -- incurring charges by calling openAI API")
        print(f"PASSING THE FOLLOWING MESSAGE TO CHAT ASSISTANT:\n{user_chat_message}")
        chat_res = chat_assistant.get_response_from_user_message(user_chat_message=user_chat_message,additional_instructions=additional_instructions)
        # chat_res = f"test response\n\n Additional instructions provided based on action history: \n{additional_instructions}"
        
        # log the chat history and append to file
        chat_history_logger.log_item(user_chat_message)
        chat_history_logger.log_item(build_prompt_str({"chat assistant":chat_res}))
        chat_history_logger.write_logs_to_file()
        chat_history_logger.flush()

    except Exception as e:
        chat_res = f"An error occurred: {str(e)}. Make sure you have an Open AI API key in your .env file :)"
    socketio.emit('response_message', {'data': chat_res}) 

@socketio.on('disconnect')
def disconnect():
    """
    Disconnects socket connection from the client.
    """
    print('Client disconnected')