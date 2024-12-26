async function getAllTeamsData() {
    const teams = [];
    const rows = document.querySelectorAll('tr');
    
    for (const row of rows) {
        const teamElement = row.querySelector('td.standings-cell--expand a');
        if (!teamElement) continue;
        
        const teamName = teamElement.textContent.trim();
        const teamUrl = teamElement.href;
        
        // Get team score
        let totalWeight = 0;
        let correctQuestions = [];
        const problemCells = Array.from(row.querySelectorAll('td')).slice(4);
        
        problemCells.forEach((cell, idx) => {
            if (idx >= 15) return;  // 15 problems (A through O)
            const isSolved = (cell.classList.contains('solved') && 
                            cell.querySelector('.fa-check.status-icon.cell-solved')) ||
                           (cell.classList.contains('first') && 
                            cell.querySelector('.fa-check.status-icon.cell-first'));
            if (isSolved) {
                totalWeight++;
                correctQuestions.push(idx + 1);
            }
        });
        
        // calculate wildcards
        let wildcards = Math.floor(totalWeight / 3.5) - 1;
        wildcards = Math.max(0, Math.min(wildcards, 2));
        
        // get team members
        try {
            const response = await fetch(teamUrl);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            // team-data
            const teamDataScript = doc.getElementById('team-data');
            if (teamDataScript) {
                const teamData = JSON.parse(teamDataScript.textContent);
                const members = teamData.team_members.map(m => m.name).join(', ');
                
                teams.push({
                    name: teamName,
                    score: totalWeight,
                    solvedQuestions: correctQuestions.join(' '),
                    wildcards: wildcards,
                    members: members
                });
                
                // add delay
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error(`Error fetching team ${teamName}:`, error);
            teams.push({
                name: teamName,
                score: totalWeight,
                solvedQuestions: correctQuestions.join(' '),
                wildcards: wildcards,
                members: 'Error fetching members'
            });
        }
    }
    
    return teams;
}

function calculateGrade(problemsSolved) {
    // Grading scheme based on number of problems solved
    const gradingScheme = {
        11: 100,
        10: 91,
        9: 83,
        8: 76,
        7: 70,
        6: 65,
        5: 61,
        4: 58,
        3: 56,
        2: 55
    };
    
    // If problems solved is greater than 11, return 100
    if (problemsSolved >= 11) return 100;
    // If problems solved is less than 2, return 50
    if (problemsSolved < 2) return 50;
    // Otherwise return the corresponding grade
    return gradingScheme[problemsSolved];
}

function processIndividuals(teams) {
    // Get all individuals with their team scores
    const individuals = [];
    
    teams.forEach(team => {
        if (team.members !== 'Error fetching members') {
            const memberNames = team.members.split(', ').filter(name => name.trim());
            memberNames.forEach(name => {
                individuals.push({
                    name: name.trim(),
                    teamName: team.name,
                    problemsSolved: team.score,
                    solvedQuestions: team.solvedQuestions,
                    grade: calculateGrade(team.score)
                });
            });
        }
    });
    
    // Sort alphabetically by name
    return individuals.sort((a, b) => a.name.localeCompare(b.name));
}

async function generateCSV() {
    const teams = await getAllTeamsData();
    teams.sort((a, b) => a.name.localeCompare(b.name));
    
    // Create team data CSV
    const teamCsvContent = "Team Name,Score,Solved Questions,Wildcards,Team Members\n" +
        teams.map(team => 
            `${team.name},${team.score},${team.solvedQuestions},${team.wildcards},${team.members}`
        ).join('\n');
    
    // Get sorted individuals with grades
    const sortedIndividuals = processIndividuals(teams);
    
    // Create individual data CSV
    const individualCsvContent = "Student Name,Team Name,Problems Solved,Solved Questions,Grade\n" +
        sortedIndividuals.map(individual => 
            `${individual.name},${individual.teamName},${individual.problemsSolved},${individual.solvedQuestions},${individual.grade}`
        ).join('\n');

    // Save team data
    const teamBlob = new Blob([teamCsvContent], { type: 'text/csv' });
    const teamUrl = window.URL.createObjectURL(teamBlob);
    const teamLink = document.createElement('a');
    teamLink.href = teamUrl;
    teamLink.download = 'kattis_team_results.csv';
    document.body.appendChild(teamLink);
    teamLink.click();
    window.URL.revokeObjectURL(teamUrl);
    teamLink.remove();

    // Save individual data
    const individualBlob = new Blob([individualCsvContent], { type: 'text/csv' });
    const individualUrl = window.URL.createObjectURL(individualBlob);
    const individualLink = document.createElement('a');
    individualLink.href = individualUrl;
    individualLink.download = 'kattis_individual_results.csv';
    document.body.appendChild(individualLink);
    individualLink.click();
    window.URL.revokeObjectURL(individualUrl);
    individualLink.remove();
}

generateCSV();