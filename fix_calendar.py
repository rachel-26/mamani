import os

def fix_html_calendar(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Change text input to date input
    content = content.replace(
        'type="text" value="Today, 24 May"',
        'type="date" id="transaction-date"'
    )
    
    # Also add JS to set today's date
    if 'id="transaction-date"' in content and 'document.getElementById(\'transaction-date\').value' not in content:
        js_to_add = """
        // Set today's date for the date input
        const dateInput = document.getElementById('transaction-date');
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
"""
        content = content.replace('</script>', js_to_add + '\n    </script>')
    
    with open(filepath, 'w') as f:
        f.write(content)

for file in ['addTransaction.html', 'frontend/addTransaction.html']:
    if os.path.exists(file):
        fix_html_calendar(file)

print("Done fixing calendar in HTML.")
