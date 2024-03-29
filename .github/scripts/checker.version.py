#execute a command and return the output
import subprocess
import json
import sys
import os

command = 'git show origin/master:documentation/versions.json'

output = subprocess.check_output(command, shell=True)
version_master = output.decode('utf-8')
version_master = json.loads(version_master)
last_version_master = int(version_master[0].replace('.', ''))

path_version_local = os.path.join(os.getcwd(), 'documentation', 'versions.json')
with open(path_version_local, 'r') as f:
  version_local = json.load(f)
  last_version_local = int(version_local[0].replace('.', ''))

print("Last version master:", last_version_master)
print("Last version local:", last_version_local)

if (last_version_local > last_version_master):
  print("Local version is greater than master version")
  sys.exit(0)
else:
  print("Local version is equal or less than master version")
  sys.exit(1)
