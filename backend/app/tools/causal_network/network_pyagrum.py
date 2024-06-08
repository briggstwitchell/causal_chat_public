import pyAgrum as gum
import pyAgrum.causal as csl
import pandas as pd
import pyAgrum.lib.explain as expl

import os
from typing import List, Dict
import matplotlib
matplotlib.use('agg')
import math
from IPython.display import Math, Latex

class CausalNetwork:
    """
    Causal network .

    attributes:
    - data_path (str): path to file where csv data is stored.
    - df (pandas.DataFrame): dataframe holding data from data_path.
    - structure_path (str): path to the bif file where the causal network structure is stored.
    - assumptions (list): list of assumptions to use for learning the causal network.
    - learning_algorthm (str): the learning algorithm to use for the causal network.
    
    Methods:
    - set_causal_network
    - learn_causal_network
    - set_network_cytoscape_elements
    - get_network_cytoscape_elements
    - get_network_df
    - update_network
    - get_causal_estimate
    - get_network_adjacency_matrix_str
    """
    def __init__(self,data_path:str,structure_path:str=None,assumptions:dict=None, treatment:str=None, outcome:str=None)->None:
        """
        Constructor for a new causal network.
        """
        self.data_path = data_path
        self.df = pd.read_csv(data_path)
        self.structure_path = structure_path
        self.assumptions = assumptions
        self.set_causal_network()
        self.set_network_cytoscape_elements()
        self.learning_algorthm = "greedy hill climbing"

    def __str__(self)->str:
        """
        Returns a string representation of the causal network.
        """
        nodes = [n for n in self.causal_network.names()]
        nodes_str = '\t\n'.join(nodes)
        
        edges = [f'{self.causal_network.variable(e[0]).name()}->{self.causal_network.variable(e[1]).name()}' for e in self.causal_network.arcs()]
        edges_str = '\t\n'.join(edges)

        return f'\n{'='*20}\nNODES:\n{nodes_str}\n{'='*20}\nEDGES:\n{edges_str}'

    def set_causal_network(self)->None:
        """
        Sets this networks causal network to a gum.BayNet based on a structure_path or learning algorithm.
        """
        if self.structure_path:
            self.causal_network = gum.loadBN(self.structure_path)
        else:
            self.learn_causal_network()    

    def learn_causal_network(self)->None:
        """
        Sets this networks causal network to a gum.BayNet based on a learning algorithm (currently pyAgrum default), this network's data, and this network's assumptions (if any)
        """
        df = pd.read_csv(self.data_path)
        learner = gum.BNLearner(df)
        if self.assumptions:
            for assumption_type in self.assumptions.keys():
                if assumption_type == 'learning_order':
                    learner.setSliceOrder(self.assumptions['learning_order'])
                else:
                    # TODO may add more keys
                    pass
        learner.useScoreBIC()
        learner.useSmoothingPrior(1e-5)
        self.causal_network = learner.learnBN()

    def set_network_cytoscape_elements(self)->None:
        """
        Sets this network's cytoscape elements to a list of dicts representing the network graph (translation function between pyAgrum and cytoscape graph representations).
        """
        cytoscape_elements = []

        for node_name in self.causal_network.names():
            cytoscape_elements.append({
                'data': {'id': node_name, 'label': node_name}
            })

        for j in self.causal_network.arcs():
            source_index = j[0]
            target_index = j[1]
            
            source_name = self.causal_network.variable(source_index).name()
            target_name = self.causal_network.variable(target_index).name()

            cytoscape_elements.append({
                'data': {'source': source_name, 'target': target_name, 'label': f'{source_name}->{target_name}',
                'id': f'{source_name}->{target_name}'}
            })

        self.cytoscape_elements = cytoscape_elements
    
    def get_network_cytoscape_elements(self)->list[dict]:
        """
        Returns the network's cytoscape elements.
        """
        return self.cytoscape_elements
    
    # def get_network_json_elements(self):
    #     graph_dot = self.causal_network.toDot().replace('""', '"')
    #     file_like_object = io.StringIO(graph_dot)
    #     dot_graph = nx.nx_pydot.read_dot(file_like_object)
    #     return json.dumps(json_graph.node_link_data(dot_graph))

    def get_network_df(self,cols=None)->dict:
        """
        Returns the network's data frame for the underlying data associated with the network.
        """
        if cols:
            return self.df[cols]
        return self.df

    def _delete_edge(self,deletion):
        """
        helper method for update network -- deletes an edge from the network
        """
        try:
            source_index = self.causal_network.idFromName(deletion['data']['source'])
            target_index = self.causal_network.idFromName(deletion['data']['target'])
            if self.causal_network.existsArc(source_index, target_index):
                self.causal_network.eraseArc(source_index, target_index)
        except Exception as e:
            print(f"Error encountered for deletion: {deletion}; {e}")

    def _add_edge(self,addition):
        """
        helper method for update network -- adds an edge to the network
        """
        try:
            source_index = self.causal_network.idFromName(addition['data']['source'])
            target_index = self.causal_network.idFromName(addition['data']['target'])
            if not self.causal_network.existsArc(source_index, target_index):
                self.causal_network.addArc(source_index, target_index)
        except Exception as e:
            print(f"Error encountered for addition: {addition}; {e}")

    def update_network(self, changes:List[Dict[str, any]])->None:
        """
        Updates the edges in the network.
        :param change: a list of updates to make to the networ
            - example format: {'data': {'source': source_name, 'target': target_name}}
        """
        if changes:
            for change in changes:
                if 'deletion' in change:
                    self._delete_edge(change['deletion'])
                else:
                    self._add_edge(change['addition'])
        
        self.set_network_cytoscape_elements()
    
    def _reformat_pandas_series_dict(self,old_dict)->dict:
        """
        Helper to reformat a pandas series dict to a nested dict
        """
        new_dict = {}
        for (outer_key, inner_key), value in old_dict.items():
            if outer_key not in new_dict:
                new_dict[outer_key] = {}
            new_dict[outer_key][inner_key] = value
        return new_dict

    def get_causal_estimate(self,on, doing, knowing=None, values=None)->tuple[dict, str,str]:
        """
        Estimates a causal estimate between two given variables (wrapper for pyAgrum.causal.causalImpact).
        
        :param on: outcome variable
        :param doing: treatment variable
        :param knowing: conditioning variables
        :param values: values for the doing and knowing variables

        return: tuple[dict, str] - causal estimate dict and string of estimate explanation
        """
        # TODO this implementation is bad as it instantiates a new causal model each time
        # TODO outcomes suggest this could be wrong implementation and directions aren't being set for graph -- test further
        causal_model = csl.CausalModel(self.causal_network)
        formula, effect, explanation = csl.causalImpact(causal_model, on, doing, knowing, values)
        effect = self._reformat_pandas_series_dict(dict(effect.topandas().round(decimals=3)))
        return effect, explanation, formula.toLatex()

    def get_independence_test_dict(self,target=None):
        """
        Wrapper for pyAgrum expl.independenceListForPairs

        Parameters:
        self (object): The instance of the class containing the causal network and data path.
        target (str, optional): The target variable to test for conditional independence. Defaults to None.

        Returns:
        dict: A dictionary containing the results of independence tests for pairs of variables.
        """
        if target:
            ind_dict = expl.independenceListForPairs(self.causal_network,self.data_path,target=target)
        else:
            ind_dict = expl.independenceListForPairs(self.causal_network,self.data_path)
        return ind_dict
    
    def get_network_adjacency_matrix_str(self)->str:
        """
        Gets a string for an adjacency matrix representation of the network graph.

        return: str - adjacency matrix representation of the network graph.
        """
        # TODO make sure the strings are in same order as the nodes represented in adj matrix
        # breakpoint()
        node_names =[self.causal_network.variable(node).name() for node in self.causal_network.nodes()]
        str = ''
        for name in node_names:
            str += name + ', '
        
        adjacency_matrix_str = f"\n{self.causal_network.adjacencyMatrix()}"
        str += adjacency_matrix_str
        return str
        
    def get_markov_blanket(self,target:str)->list[str]:
        '''
        Return a list of node names that represent the markov blanket of a target node in the network

        param target: variable for which the markov blanket will be returned
        
        return: list[str] - list of the markov blank for the target node
        '''
        target_mb = gum.MarkovBlanket(self.causal_network,target)
        return [self.causal_network.variable(node).name() for node in target_mb.nodes()]