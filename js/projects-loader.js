// Projects Loader - Dynamically loads project cards from CSV files
// This script populates the projects.html page with cards from each project's CSV

class ProjectsLoader {
  constructor() {
    this.projectsContainer = document.querySelector('.m3-project-cards-container');
    this.projects = [];
    // List of project folders to load (can be extended or made dynamic)
    this.projectFolders = ['tenThousand', 'TheBrady', 'TheRockwell'];
  }

  async loadProjects() {
    if (!this.projectsContainer) {
      console.error('Projects container not found');
      return;
    }

    try {
      // Load all project CSVs in parallel
      const projectPromises = this.projectFolders.map(folder => 
        this.loadProjectData(folder)
      );

      this.projects = await Promise.all(projectPromises);
      
      // Filter out failed projects
      this.projects = this.projects.filter(p => p !== null);
      
      // Populate the page with project cards
      this.populateProjectCards();
    } catch (error) {
      console.error('Error loading projects:', error);
      this.showError('Failed to load projects. Please refresh the page.');
    }
  }

  async loadProjectData(projectFolder) {
    try {
      const csvUrl = `projects/${projectFolder}/project.csv`;
      const response = await fetch(csvUrl);
      
      if (!response.ok) {
        console.warn(`Project ${projectFolder} CSV not found`);
        return null;
      }

      const csvText = await response.text();
      const projectData = this.parseTransposedCSV(csvText);
      
      // Add metadata
      projectData._folder = projectFolder;
      projectData._pageUrl = `${projectFolder}.html`;
      projectData._headerImage = `projects/${projectFolder}/header.jpg`;
      
      return projectData;
    } catch (error) {
      console.error(`Error loading project ${projectFolder}:`, error);
      return null;
    }
  }

  parseTransposedCSV(csvText) {
    // Parse transposed CSV: headers in column A, data in column B
    // Handle multi-line quoted values properly
    const rows = this.parseCSVRows(csvText.trim());
    if (rows.length === 0) throw new Error('Invalid CSV format');

    const projectData = {};
    
    rows.forEach(row => {
      if (row.length >= 2) {
        const header = row[0].trim();
        // Join remaining columns in case value contains commas
        const value = row.slice(1).join(',').trim();
        projectData[header] = value;
      } else if (row.length === 1 && row[0].trim()) {
        // Handle case where header exists but value might be empty
        const header = row[0].trim();
        if (!projectData[header]) {
          projectData[header] = '';
        }
      }
    });

    return projectData;
  }

  parseCSVRows(csvText) {
    // Parse CSV rows handling quoted fields that may span multiple lines
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;
    let i = 0;

    while (i < csvText.length) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        currentRow.push(currentField);
        currentField = '';
        i++;
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        // End of row (but check for \r\n)
        if (char === '\r' && nextChar === '\n') {
          i += 2;
        } else {
          i++;
        }
        // Only end row if we have content
        if (currentField || currentRow.length > 0) {
          currentRow.push(currentField);
          if (currentRow.length > 0 && (currentRow[0].trim() || currentRow.length > 1)) {
            rows.push(currentRow);
          }
          currentRow = [];
          currentField = '';
        }
      } else {
        currentField += char;
        i++;
      }
    }

    // Handle last field/row
    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField);
      if (currentRow.length > 0 && (currentRow[0].trim() || currentRow.length > 1)) {
        rows.push(currentRow);
      }
    }

    return rows;
  }

  populateProjectCards() {
    // Clear existing content
    this.projectsContainer.innerHTML = '';

    // Create a card for each project
    this.projects.forEach(project => {
      const card = this.createProjectCard(project);
      this.projectsContainer.appendChild(card);
    });
  }

  createProjectCard(project) {
    const article = document.createElement('article');
    article.className = 'm3-project-card';

    const projectName = project.ProjectName || 'Project';
    const city = project.City || '';
    const cardBlurb = project['Card Blurb'] || project.Blurb || '';
    const pageUrl = project._pageUrl;
    const headerImage = project._headerImage;
    const title = city ? `${projectName} - ${city}` : projectName;

    article.innerHTML = `
      <div class="m3-project-card__content">
        <div>
          <a href="${pageUrl}">
            <img src="${headerImage}" alt="${title}" class="m3-project-card__image">
          </a>
        </div>
        <div class="m3-project-card__text">
          <h3 class="m3-project-card__title">
            <a href="${pageUrl}">${title}</a>
          </h3>
          <p class="m3-project-card__description">
            ${cardBlurb}
          </p>
          <div class="m3-project-card__actions">
            <a href="${pageUrl}" class="m3-button m3-button--text">
              Details
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5l8 7-8 7V5z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;

    return article;
  }

  showError(message) {
    if (this.projectsContainer) {
      this.projectsContainer.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--md-sys-color-error);">${message}</div>`;
    }
  }
}
