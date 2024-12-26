// Initialize an empty array to store the results
const studentResultsArray = [];

// Define the weights for each question
const questionWeights = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // Update this array to match the number of problems

// Set the threshold value for full marks
const thresholdValue = 3.5; // Adjust this value as needed

// Loop through each student row
document.querySelectorAll('tr').forEach((row, index) => {
  // Skip the header row
  if (index === 0) return;
  
  // Get the student's name from the first cell
  const studentNameElement = row.querySelector('td.standings-cell--expand a');
  if (studentNameElement) {
    const studentName = studentNameElement.textContent.trim();
    
    // Initialize the total weight for this student
    let totalWeight = 0;
    
    // Initialize an array to store the questions a student got right
    let correctQuestions = [];
    
    // Loop through each cell in the row
    const cells = row.querySelectorAll('td');
    cells.forEach((cell, cellIndex) => {
      // Assuming the problems start at the third cell and match the length of questionWeights
      if (cellIndex > 1 && cellIndex <= 1 + questionWeights.length) {
        const problemIndex = cellIndex - 2; // Adjust based on actual table structure
        const isSolved = cell.classList.contains('solved') || cell.querySelector('i.fas.fa-check.status-icon.cell-solved');
        if (isSolved) {
          totalWeight += questionWeights[problemIndex];
          correctQuestions.push(problemIndex + 1); // +1 to make it 1-indexed
        }
      }
    });
    
    // Calculate wildcards
    let wildcards = 0;
    if (totalWeight >= thresholdValue * 2) wildcards = 1;
    if (totalWeight >= thresholdValue * 3) wildcards = 2;
    
    // Add the result to the array
    studentResultsArray.push({
      name: studentName,
      score: totalWeight,
      solvedQuestions: correctQuestions.join(' '), // Join the array with space delimiter
      wildcards: wildcards
    });
  }
});

// Sort the array alphabetically, ignoring case
studentResultsArray.sort((a, b) => a.name.localeCompare(b.name, undefined, {sensitivity: 'base'}));

// Create a CSV string
let csvContent = "Name,Score,Solved Questions,Wildcards\n";
studentResultsArray.forEach(student => {
  csvContent += `${student.name},${student.score},${student.solvedQuestions},${student.wildcards}\n`;
});

// Log the CSV content to the console
console.log(csvContent);

// Create a button to copy the CSV content
const copyButton = document.createElement('button');
copyButton.textContent = 'Copy Results to Clipboard';
copyButton.style.position = 'fixed';
copyButton.style.top = '10px';
copyButton.style.right = '10px';
copyButton.style.zIndex = '9999';
document.body.appendChild(copyButton);

copyButton.addEventListener('click', () => {
  navigator.clipboard.writeText(csvContent).then(() => {
    alert('Results copied to clipboard! You can now paste them into Excel.');
  }, () => {
    alert('Failed to copy results. Please check console and copy manually.');
  });
});