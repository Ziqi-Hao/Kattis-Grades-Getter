# Kattis Contest Grading Tools

A collection of tools designed for managing and calculating scores for Kattis-based programming contests, with specific support for weighted problem scoring and team/individual performance tracking.

## Tools Included

### 1. Individual Grade Calculator (`kattisIndividualGradesGetter.js`)

Extracts and calculates individual performance data from Kattis individual standings pages with customizable problem weights.

#### Features:
- Calculates scores based on weighted problem values
- Tracks solved problems for each student
- Calculates wildcards based on cumulative score thresholds
- Generates CSV output with detailed results
- Automatic sorting by student name

#### Problem Weights:
```javascript
const questionWeights = [
    1.5,  // Problem 1
    2.5,  // Problem 2
    1.25, // Problem 3
    3.5,  // Problem 4
    0.75, // Problem 5
    1.75, // Problem 6
    1.0,  // Problem 7
    2.5,  // Problem 8
    0.75, // Problem 9
    1.75, // Problem 10
    3.5,  // Problem 11
    2.5,  // Problem 12
    1.5,  // Problem 13
    3.5,  // Problem 14
    0.75  // Problem 15
];
```

### 2. Team Grade Calculator (`kattisTeamGradesGetter.js`)

Extracts team performance data and generates both team and individual reports.

#### Features:
- Collects team scores and solved problems
- Retrieves team member information
- Calculates wildcards based on performance
- Generates two CSV files:
  - Team results with membership data
  - Individual results with grade calculations
- Automatic grade calculation based on number of problems solved

### 3. Assignment-Contest Difference Calculator (`assignmentContestDiff.js`)

Calculates score differences between assignment submissions and contest performance.

#### Features:
- Identifies newly solved problems
- Available as both Google Sheets script and React component
- Calculates adjusted scores based on problem weights

## Usage Instructions

### For Individual Grade Calculator:
1. Navigate to your Kattis individual standings page
2. Open browser developer tools (F12)
3. Copy and paste the code from `kattisIndividualGradesGetter.js`
4. Results will be displayed in console and can be copied to clipboard

### For Team Grade Calculator:
1. Navigate to your Kattis contest standings page
2. Open browser developer tools (F12)
3. Copy and paste the code from `kattisTeamGradesGetter.js`
4. Two CSV files will automatically download:
   - `kattis_team_results.csv`
   - `kattis_individual_results.csv`

### For Assignment-Contest Calculator:
1. Choose either Google Sheets or React implementation
2. Follow setup instructions in the code comments
3. Input data in required format (original problems in column D, new attempts in column H)

## Customization

### Modifying Problem Weights:
Update the `questionWeights` array in `kattisIndividualGradesGetter.js`:
```javascript
const questionWeights = [
    1.5, // Weight for Problem 1
    2.5, // Weight for Problem 2
    // ... add/modify weights as needed
];
```

### Adjusting Wildcard Thresholds:
Modify the `thresholdValue` constant:
```javascript
const thresholdValue = 3.5; // Adjust this to change wildcard calculation
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## Acknowledgments

These tools were originally developed for managing programming contest scores at McGill University.