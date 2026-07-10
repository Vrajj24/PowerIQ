import os
import subprocess

def run_cmd(cmd):
    return subprocess.run(cmd, shell=True, capture_output=True, text=True)

# Initialize git
run_cmd("git init")
run_cmd("git remote add origin https://github.com/Vrajj24/PowerIQ.git")

# Make sure we don't commit node_modules or dist by using git status to get untracked files
# Add everything to index first to respect gitignore
run_cmd("git add .")

# Now get the list of added files
status = run_cmd("git status --porcelain")
files = []
for line in status.stdout.split('\n'):
    if line.strip():
        # format: "A  path/to/file"
        file_path = line[3:].strip()
        files.append(file_path)

if not files:
    print("No files to commit.")
    exit(0)

# Unstage everything so we can add one by one
run_cmd("git reset")

# Commit one by one
count = 0
for f in files:
    if os.path.isdir(f):
        continue
    print(f"Committing {f}...")
    run_cmd(f'git add "{f}"')
    run_cmd(f'git commit -m "Add {os.path.basename(f)}"')
    count += 1

print(f"Created {count} individual commits!")

# Push to origin (default branch typically master or main)
print("Pushing to remote...")
run_cmd("git branch -M main")
push_result = run_cmd("git push -u origin main --force")
print(push_result.stdout)
print(push_result.stderr)
print("Done!")
