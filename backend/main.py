from app.main.app import create_app, socketio
# from config import APP_PORT, APP_HOST
from dotenv import load_dotenv,dotenv_values, set_key

import os
from openai import OpenAI
__all__ = ["main"]

def main()-> None:
    app = create_app()

    host_var_name = "BACKEND_HOST"
    host = os.getenv(host_var_name, '0.0.0.0')
    
    port_var_name = "BACKEND_PORT"
    port = os.getenv(port_var_name, 8000)

    print(f'Running app backend at host {host}, port {port}...')
    socketio.run(app,port=port, host=host, debug=True, allow_unsafe_werkzeug=True)

main()