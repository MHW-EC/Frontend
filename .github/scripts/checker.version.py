#execute a command and return the output
import subprocess
import json
import os

command = 'git show origin/master:documentation/versions.json'

try:
  output = subprocess.check_output(command, shell=True)
except subprocess.CalledProcessError as e:
  print("Error:", e.output)

version_master = output.decode('utf-8')
version_master = json.loads(version_master)
print("Version master:", version_master)
last_version_master = int(version_master[-1].replace('.', ''))

path_version_local = os.path.join(os.getcwd(), 'documentation', 'versions.json')
with open(path_version_local, 'r') as f:
  version_local = json.load(f)
  print("Version local:", version_local)
  last_version_local = int(version_local[-1].replace('.', ''))

if (last_version_local > last_version_master):
  print("Local version is greater than master version")
  exit(1)
else:
  print("Local version is equal or less than master version")
  exit(0)
