import os
import json
import re

def env_to_json(env_file_path, json_file_path):
    """
    Read data from a .env file and convert it to a JSON file.
    
    Args:
        env_file_path (str): Path to the .env file
        json_file_path (str): Path to save the JSON file
    """
    # Dictionary to store the key-value pairs
    env_data = {}
    
    # Check if the .env file exists
    if not os.path.exists(env_file_path):
        print(f"Error: The file {env_file_path} does not exist.")
        return False
    
    # Read the .env file
    with open(env_file_path, 'r') as env_file:
        for line in env_file:
            # Skip empty lines and comments
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            
            # Parse the key-value pair
            if '=' in line:
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip()
                
                # Remove quotes if present
                if (value.startswith('"') and value.endswith('"')) or \
                   (value.startswith("'") and value.endswith("'")):
                    value = value[1:-1]
                
                # Try to convert value to appropriate data type
                if value.lower() == 'true':
                    value = True
                elif value.lower() == 'false':
                    value = False
                elif value.isdigit():
                    value = int(value)
                elif re.match(r'^-?\d+(\.\d+)?$', value):
                    value = float(value)
                
                # Add to dictionary
                env_data[key] = value
    
    # Write to JSON file
    with open(json_file_path, 'w') as json_file:
        json.dump(env_data, json_file, indent=2)
    
    print(f"Successfully converted {env_file_path} to {json_file_path}")
    return True

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) == 3:
        env_file = sys.argv[1]
        json_file = sys.argv[2]
    else:
        env_file = input("Enter the path to the .env file: ")
        json_file = input("Enter the path for the JSON file: ")
    
    env_to_json(env_file, json_file)
