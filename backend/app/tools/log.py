class Log:
    """
    A class for logging user interactions and system responses.
    """
    def __init__(self, file_path:str=None):
        self.file_path = file_path
        self.log = []
        self.active = True

    def log_item(self, item:str)->None:
        """
        Log an item.
        """
        if self.active:
            print(f"LOGGING: {item}")
            self.log.append(item)
        else:
            print("NOT LOGGING BECAUSE LOGGING IS DEACTIVATED")

    def activate(self)->None:
        """
        Activate logging.
        """
        print("LOGGING ACTIVATED")
        self.active = True

    def deactivate(self)->None:
        """
        Deactivate logging.
        """
        print("LOGGING DEACTIVATED")
        self.active = False

    def write_logs_to_file(self)->None:
        """
        Write current log to a file.
        """
        if self.file_path:
            print(f"writing logs to file {self.file_path}")
            with open(self.file_path, 'a') as file:
                for item in self.log:
                    file.write(item + '\n')
                    
    def flush(self)->None:
        """
        Clear all log data.
        """
        self.log = []
    
    def get_log(self)->list:
        """
        Get the current log.
        """
        return self.log
    
    def get_log_and_flush(self)->list:
        """
        Get the current log and clear it.
        """
        log = self.log
        self.flush()
        return log