Get-ChildItem -Path client\src -Filter *.jsx -Recurse | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName)
    # Replace single quotes: 'http://localhost:5001/ -> (import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/
    $content = $content.Replace("'http://localhost:5001/", "(import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/")
    
    # Replace backticks: `http://localhost:5001/ -> `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/
    # We use double quotes for the SEARCH but single quotes for REPLACEMENT if we have $ or we escape $ e.g. "`$".
    # Since we use .Replace() which is literal, we don't need backticks in searching unless they are in the file.
    # In JS, backticks are used as delimiters.
    $content = $content.Replace("``http://localhost:5001/", "`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/")
    
    [System.IO.File]::WriteAllText($_.FullName, $content)
}
