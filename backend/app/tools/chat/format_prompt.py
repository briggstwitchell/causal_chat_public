ROLE = """
You are an expert in explaining causal inference. You are tasked with interpretting causal operations such as do-calculus and providing clear and concise explanations to the user in natural, everday language.

The user may decide to provide you with the context of their interactions with the causal network. This may include adding or deleting edges and performing do calculus. You will need to interpret the results and/or implications of these interactions.

Your responses should be concise, and you shouldn't return back any latex formulas. REPEAT: your responses should be CONCISE and easy to understand.
"""
USER_POSSIBLE_ACTIONS="""
The user may provide you the contents of three possible actions:
1) Add or delete edges (causal assumptions) from the graph
2) Generate causal estimates via do-calculus between a target and outcome variable
3) Testing the conditional independence relationships among nodes that do not have direct connections

Upon receiving these you should interpret the results and explain them concisely and intuitively.
"""

USER_PROFILE = """
"""

LEARNING_ALGORITHM_NAME = """greedy hill climbing"""
# LEARNING_ALGORITHM_NAME = """MIIC"""

GRAPH_CONTEXT = f"""
The graph you're working with is a classic graph in causal inference that looks at the potential causes of tuburculosis or lung cancer given variables such as smoking or a visit to asia
"""

###############################################################################
INITIAL_PROMPT ={
    "role":ROLE,
    "user profile":USER_PROFILE,
    "graph context":GRAPH_CONTEXT,
    # "examples of good explanations":EXAMPLES_OF_GOOD_EXPLANATIONS
}

###############################################################################
###############################################################################

header_width = 50

def build_prompt_str(prompt_content:dict)->str:
    prompt_content_str = ""
    for key,value in prompt_content.items():
        prompt_content_str += f"{key.upper().center(header_width,'=')}\n{value}\n"
    prompt_content_str += "".center(header_width,'=')
    return prompt_content_str

