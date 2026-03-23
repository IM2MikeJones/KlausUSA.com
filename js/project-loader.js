// Project Loader - Dynamically loads project data from CSV and carousel images
// This script loads project information from the projects folder structure

class ProjectLoader {
  constructor(projectFolder) {
    this.projectFolder = projectFolder;
    this.projectPath = `projects/${projectFolder}/`;
    this.projectData = null;
    this.carouselImages = [];
  }

  async loadProject() {
    try {
      // Load project CSV and carousel images list in parallel
      const [csvData, imagesData] = await Promise.all([
        this.loadCSV(`${this.projectPath}project.csv`),
        this.loadImagesList(`${this.projectPath}carousel/`)
      ]);

      // Parse CSV data (transposed format: headers in column A, data in column B)
      this.projectData = this.parseTransposedCSV(csvData);
      
      // Store carousel images
      this.carouselImages = imagesData;

      // Populate the page
      this.populatePage();
      this.populateCarousel();

      // Initialize carousel slider after images are loaded
      this.initCarousel();
    } catch (error) {
      console.error('Error loading project data:', error);
      this.showError('Failed to load project data. Please refresh the page.');
    }
  }

  async loadCSV(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load CSV: ${response.statusText}`);
    return await response.text();
  }

  async loadImagesList(carouselPath) {
    // Load images from images.txt file (one filename per line)
    // This file should be in the carousel folder and can be easily edited by marketing
    try {
      const response = await fetch(`${carouselPath}images.txt`);
      if (response.ok) {
        const text = await response.text();
        // Parse text file: one filename per line, ignore empty lines and comments
        const images = text.split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('#') && !line.startsWith('//'));
        if (images.length > 0) {
          return images;
        }
      }
    } catch (e) {
      console.warn('Could not load images.txt file:', e);
    }

    console.warn('No images found. Please create an images.txt file in the carousel folder with one image filename per line.');
    return [];
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
        // Column B: Value
        // Column C (optional): Link
        const valueFields = row.slice(1);
        // Remove trailing empty fields
        while (valueFields.length > 0 && valueFields[valueFields.length - 1].trim() === '') {
          valueFields.pop();
        }
        
        if (valueFields.length === 0) {
          projectData[header] = '';
          projectData[`${header}_Link`] = '';
        } else if (valueFields.length === 1) {
          // Only value, no link
          projectData[header] = valueFields[0].trim();
          projectData[`${header}_Link`] = '';
        } else {
          // Value and optional link(s)
          // If there are multiple fields, the last non-empty field is treated as link(s)
          // All others are joined as value (in case value contains commas)
          const linkField = valueFields[valueFields.length - 1].trim();
          const valueField = valueFields.slice(0, -1).join(',').trim();
          
          projectData[header] = valueField || linkField; // If only link provided, use it as value too
          projectData[`${header}_Link`] = linkField && valueField ? linkField : '';
        }
      } else if (row.length === 1 && row[0].trim()) {
        // Handle case where header exists but value might be empty
        const header = row[0].trim();
        if (!projectData[header]) {
          projectData[header] = '';
          projectData[`${header}_Link`] = '';
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

  parseCSV(csvText) {
    // Legacy method - keeping for backwards compatibility if needed
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) throw new Error('Invalid CSV format');

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Parse data row (assuming single project per CSV)
    const dataRow = lines[1];
    const values = this.parseCSVRow(dataRow);
    
    // Create object from headers and values
    const projectData = {};
    headers.forEach((header, index) => {
      projectData[header] = values[index] || '';
    });

    return projectData;
  }

  parseCSVRow(row) {
    const values = [];
    let currentValue = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"') {
        if (inQuotes && row[i + 1] === '"') {
          // Escaped quote
          currentValue += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of value
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    // Add last value
    values.push(currentValue.trim());
    
    return values;
  }

  populatePage() {
    if (!this.projectData) return;

    const data = this.projectData;

    // Update page title
    document.title = `Project - ${data.ProjectName}, ${data.City} - Klaus Multiparking`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = `${data.ProjectName} - ${data.City} Project - Klaus Multiparking Automated Parking Systems`;
    }

    // Update header image
    const headerImg = document.getElementById('project-header-image');
    if (headerImg) {
      headerImg.src = `${this.projectPath}header.jpg`;
      headerImg.alt = `${data.ProjectName}, ${data.City}`;
    }

    // Update project name and city (both from CSV)
    const projectNameEl = document.getElementById('project-name');
    if (projectNameEl) {
      projectNameEl.textContent = data.ProjectName || '';
    }

    // City appears under the title - populated from CSV
    const projectCityEl = document.getElementById('project-city');
    if (projectCityEl) {
      projectCityEl.textContent = data.City || '';
    }

    // Update description (using Page Blurb from CSV)
    // Preserves newlines and empty lines as paragraph breaks
    const descriptionEl = document.getElementById('project-description');
    if (descriptionEl && data['Page Blurb']) {
      const html = this.formatMultiLineText(data['Page Blurb']);
      descriptionEl.innerHTML = html;
    } else if (descriptionEl && data.Blurb) {
      // Fallback to old "Blurb" field name for backwards compatibility
      const html = this.formatMultiLineText(data.Blurb);
      descriptionEl.innerHTML = html;
    }

    // Update project details - all fields populated from CSV
    const installedDateEl = document.getElementById('project-installed-date');
    if (installedDateEl) {
      installedDateEl.textContent = data.InstalledDate || data.Installed || '';
    }

    // City also appears in specifications - populated from same CSV field
    const cityDetailEl = document.getElementById('project-city-detail');
    if (cityDetailEl) {
      cityDetailEl.textContent = data.City || '';
    }

    const stallsEl = document.getElementById('project-stalls');
    if (stallsEl) {
      stallsEl.textContent = data.NumberOfStalls || data.Stalls || data['Number of Stalls'] || '';
    }

    const modelEl = document.getElementById('project-model');
    if (modelEl && data.Model) {
      // Split model field by newlines to handle multiple models
      const models = data.Model.split(/\r?\n/).map(m => m.trim()).filter(m => m !== '');
      
      // Get links from CSV (third column) if available
      const modelLinks = data.Model_Link ? data.Model_Link.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '') : [];
      
      if (models.length > 0) {
        // Create HTML for each model (with links from CSV if available, otherwise fallback to hardcoded mapping)
        const modelHtml = models.map((model, index) => {
          // Use link from CSV if available, otherwise try hardcoded mapping
          let modelLink = modelLinks[index] || '';
          
          // If no link from CSV, fallback to hardcoded mapping
          if (!modelLink) {
            modelLink = this.getModelLink(model);
          }
          
          if (modelLink) {
            return `<a href="${modelLink}" style="color: var(--md-sys-color-primary); text-decoration: underline;">${model}</a>`;
          } else {
            return model;
          }
        }).join('<br>');
        
        modelEl.innerHTML = modelHtml;
      }
    }
  }

  getModelLink(model) {
    // Map model names to product page links
    const modelLinks = {
      'SpaceVario CP61': 'SpaceVarioCP61.html',
      'SpaceVario CP-61': 'SpaceVarioCP61.html',
      'TrendVario 6100': 'trendvario6100.html',
      'TrendVario 6200': 'trendvario6200.html',
      'TrendVario 6300': 'trendvario6300.html',
      'MultiBase 2072i': 'MultiBase2072i.html',
      'MultiBase 2078i': 'MultiBase2078i.html',
      'MultiBase G63': 'MultiBaseG63.html',
      'MultiBase U10': 'MultiBaseU10.html',
      'MultiBase U20': 'MultiBaseU20.html',
      'ParkBoard PQ': 'parkboardPQ.html'
    };
    return modelLinks[model] || null;
  }

  populateCarousel() {
    const slidesContainer = document.getElementById('carousel-slides');
    const indicatorsContainer = document.getElementById('carousel-indicators');

    if (!slidesContainer || !indicatorsContainer) return;

    // Clear existing content
    slidesContainer.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    if (!this.carouselImages || this.carouselImages.length === 0) {
      return;
    }

    // Supported image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

    // Filter to only include valid image files
    const validImages = this.carouselImages.filter(filename => {
      const lower = filename.toLowerCase();
      return imageExtensions.some(ext => lower.endsWith(ext));
    });

    if (validImages.length === 0) {
      return;
    }

    // Create slides
    validImages.forEach((imageFile, index) => {
      const slide = document.createElement('div');
      slide.className = 'm3-project-gallery__slide';
      if (index === 0) {
        slide.classList.add('m3-project-gallery__slide--active');
      }
      
      const img = document.createElement('img');
      img.src = `${this.projectPath}carousel/${imageFile}`;
      img.alt = `${this.projectData?.ProjectName || 'Project'} - Image ${index + 1}`;
      slide.appendChild(img);
      slidesContainer.appendChild(slide);
    });

    // Create indicators
    validImages.forEach((imageFile, index) => {
      const indicator = document.createElement('button');
      indicator.className = 'm3-project-gallery__indicator';
      if (index === 0) {
        indicator.classList.add('m3-project-gallery__indicator--active');
      }
      indicator.setAttribute('data-slide', index);
      indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
      indicatorsContainer.appendChild(indicator);
    });
  }

  initCarousel() {
    const gallery = document.querySelector('.m3-project-gallery');
    if (!gallery) return;

    // Wait a bit for DOM to update after dynamic content insertion
    setTimeout(() => {
      const slides = gallery.querySelectorAll('.m3-project-gallery__slide');
      const indicators = gallery.querySelectorAll('.m3-project-gallery__indicator');
      const prevBtn = gallery.querySelector('.m3-project-gallery__prev');
      const nextBtn = gallery.querySelector('.m3-project-gallery__next');
      const container = gallery.querySelector('.m3-project-gallery__container');
      
      if (slides.length === 0) return;

      let currentSlide = 0;
      const totalSlides = slides.length;
      let autoPlayInterval = null;
      const autoPlayDelay = 4000; // 4 seconds

      const showSlide = (index) => {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('m3-project-gallery__slide--active'));
        indicators.forEach(indicator => indicator.classList.remove('m3-project-gallery__indicator--active'));

        // Add active class to current slide and indicator
        if (slides[index]) {
          slides[index].classList.add('m3-project-gallery__slide--active');
        }
        if (indicators[index]) {
          indicators[index].classList.add('m3-project-gallery__indicator--active');
        }
        
        currentSlide = index;
      };

      const goToNextSlide = () => {
        const nextIndex = (currentSlide + 1) % totalSlides;
        showSlide(nextIndex);
      };

      const goToPrevSlide = () => {
        const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prevIndex);
      };

      const startAutoPlay = () => {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(goToNextSlide, autoPlayDelay);
      };

      const stopAutoPlay = () => {
        if (autoPlayInterval) {
          clearInterval(autoPlayInterval);
          autoPlayInterval = null;
        }
      };

      // Event listeners
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          stopAutoPlay();
          goToNextSlide();
          startAutoPlay();
        });
      }
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          stopAutoPlay();
          goToPrevSlide();
          startAutoPlay();
        });
      }

      // Indicator clicks
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          stopAutoPlay();
          showSlide(index);
          startAutoPlay();
        });
      });

      // Pause auto-play on hover
      if (container) {
        container.addEventListener('mouseenter', stopAutoPlay);
        container.addEventListener('mouseleave', startAutoPlay);
      }

      // Keyboard navigation
      gallery.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          stopAutoPlay();
          goToPrevSlide();
          startAutoPlay();
        } else if (e.key === 'ArrowRight') {
          stopAutoPlay();
          goToNextSlide();
          startAutoPlay();
        }
      });

      // Start auto-play
      startAutoPlay();
    }, 100);
  }

  formatMultiLineText(text) {
    // Format multi-line text: each line break creates a new paragraph
    if (!text) return '';
    
    // Split by newlines (both \n and \r\n)
    const lines = text.split(/\r?\n/);
    const paragraphs = [];
    
    lines.forEach((line) => {
      const trimmed = line.trim();
      
      // Only add non-empty lines as paragraphs (skip empty lines)
      if (trimmed !== '') {
        paragraphs.push(trimmed);
      }
    });
    
    // Convert each paragraph to HTML
    return paragraphs.map(p => `<p>${p}</p>`).join('');
  }

  showError(message) {
    const container = document.querySelector('.m3-product-detail__container');
    if (container) {
      container.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--md-sys-color-error);">${message}</div>`;
    }
  }
}
