// System Configuration Application - Uses JSON Data
// Refactored from CSV-based version to use JSON files

class ConfigureSystem {
    constructor() {
        this.systemData = {};
        this.currentConfig = {
            systemType: 'TrendVario 6300',
            numRows: 1,
            numGrids: 2,
            clearHeight: 425,
            pitDepth: 0,
            platformWidth: 'W240 (Standard)',
            platformLength: ''
        };
        
        // Store current dimension values for vehicle checking
        this.currentDimensions = {
            UL: null,
            GL: null,
            LL: null,
            LLDO: null,
            clearWidth: null,
            maxVehicle: null
        };
        
        // Callback function to notify when dimensions change
        this.onDimensionsChange = null;
        
        this.initializeElements();
        this.loadData();
        this.setupEventListeners();
    }
    
    initializeElements() {
        this.elements = {
            systemType: document.getElementById('system-type'),
            numGrids: document.getElementById('numGrids'),
            clearHeight: document.getElementById('clear-height'),
            pitDepth: document.getElementById('pit-depth'),
            platformWidth: document.getElementById('platform-width'),
            platformLength: document.getElementById('platform-length'),
            field1: document.getElementById('field1')
        };
    }
    
    async loadData() {
        try {
            // Load all JSON files
            const [lengthsData, widthsData, heightsData, pitDepthsData] = await Promise.all([
                fetch('assets/json/system-lengths.json').then(r => r.json()),
                fetch('assets/json/system-widths.json').then(r => r.json()),
                fetch('assets/json/system-heights.json').then(r => r.json()),
                fetch('assets/json/system-pit-depths.json').then(r => r.json())
            ]);
            
            // Process the data (JSON is already structured, so we can use it directly)
            this.systemData.lengths = lengthsData;
            this.systemData.widths = widthsData;
            this.systemData.heights = heightsData;
            this.systemData.pitDepths = pitDepthsData;
            
            // Populate dropdowns
            this.populateSystemTypeOptions();
            this.populateGridOptions();
            this.populateClearHeightOptions();
            this.populatePitDepthOptions();
            this.populatePlatformWidthOptions();
            this.populatePlatformLengthOptions();
            
            // Set initial values
            this.setInitialValues();
            
            // Load configuration from URL parameters after data is loaded
            this.loadFromURL();
            
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
    
    setInitialValues() {
        this.updateClearHeightDisplay();
        this.updatePitDepthDisplay();
        this.updatePlatformWidthDisplay();
        this.updatePlatformLengthDisplay();
        this.updateField1Calculation();
    }
    
    updateField1Calculation() {
        const systemType = this.currentConfig.systemType;
        const numGrids = this.currentConfig.numGrids;
        const numRows = this.currentConfig.numRows;
        
        let result = 0;
        
        if (systemType === 'TrendVario 6100' || systemType === 'TrendVario 6200') {
            result = ((numGrids * 2) - 1) * numRows;
        } else if (systemType === 'TrendVario 6300') {
            result = ((numGrids * 3) - 1) * numRows;
        }
        
        if (this.elements.field1) {
            this.elements.field1.textContent = result.toString() + ' Total Vehicles';
        }
    }
    
    notifyDimensionsChange() {
        if (this.onDimensionsChange) {
            this.onDimensionsChange();
        }
    }
    
    // URL Parameter Handling
    loadFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        const systemType = urlParams.get('S');
        if (systemType) {
            const systemTypeMap = {
                '6100': 'TrendVario 6100',
                '6200': 'TrendVario 6200',
                '6300': 'TrendVario 6300'
            };
            
            if (systemTypeMap[systemType]) {
                this.currentConfig.systemType = systemTypeMap[systemType];
                if (this.elements.systemType) {
                    this.elements.systemType.value = this.currentConfig.systemType;
                    this.populateClearHeightOptions();
                    this.populatePitDepthOptions();
                    this.populatePlatformWidthOptions();
                    this.populatePlatformLengthOptions();
                }
            }
        }
        
        const numRows = urlParams.get('R');
        if (numRows && ['1', '2', '3'].includes(numRows)) {
            this.currentConfig.numRows = parseInt(numRows);
            const radioButton = document.querySelector(`input[name="numRows"][value="${numRows}"]`);
            if (radioButton) {
                radioButton.checked = true;
            }
        }
        
        const numGrids = urlParams.get('G');
        if (numGrids && parseInt(numGrids) >= 2 && parseInt(numGrids) <= 15) {
            this.currentConfig.numGrids = parseInt(numGrids);
            if (this.elements.numGrids) {
                this.elements.numGrids.value = this.currentConfig.numGrids;
            }
        }
        
        const clearHeight = urlParams.get('H');
        if (clearHeight) {
            this.currentConfig.clearHeight = parseInt(clearHeight);
            if (this.elements.clearHeight) {
                this.elements.clearHeight.value = this.currentConfig.clearHeight;
            }
        }
        
        const pitDepthParam = urlParams.get('PD');
        if (pitDepthParam) {
            const pitDepthOptions = this.elements.pitDepth.options;
            for (let i = 0; i < pitDepthOptions.length; i++) {
                const option = pitDepthOptions[i];
                if (option.value === pitDepthParam) {
                    this.elements.pitDepth.value = option.value;
                    this.currentConfig.pitDepth = option.value;
                    break;
                }
            }
        }
        
        const platformWidthParam = urlParams.get('W');
        if (platformWidthParam) {
            const platformWidthOptions = this.elements.platformWidth.options;
            for (let i = 0; i < platformWidthOptions.length; i++) {
                const option = platformWidthOptions[i];
                if (option.value && option.value.includes('W' + platformWidthParam)) {
                    this.elements.platformWidth.value = option.value;
                    this.currentConfig.platformWidth = option.value;
                    break;
                }
            }
        }
        
        const platformLengthParam = urlParams.get('L');
        if (platformLengthParam) {
            const platformLengthOptions = this.elements.platformLength.options;
            for (let i = 0; i < platformLengthOptions.length; i++) {
                const option = platformLengthOptions[i];
                if (option.value && (option.value.startsWith('PL' + platformLengthParam) || option.value.startsWith('NL' + platformLengthParam))) {
                    this.elements.platformLength.value = option.value;
                    this.currentConfig.platformLength = option.value;
                    break;
                }
            }
        }
        
        this.updateClearHeightDisplay();
        this.updatePitDepthDisplay();
        this.updatePlatformWidthDisplay();
        this.updatePlatformLengthDisplay();
        this.updateField1Calculation();
    }
    
    saveToURL() {
        const urlParams = new URLSearchParams();
        
        const systemNumber = this.currentConfig.systemType.split(' ')[1];
        urlParams.set('S', systemNumber);
        urlParams.set('R', this.currentConfig.numRows.toString());
        urlParams.set('G', this.currentConfig.numGrids.toString());
        urlParams.set('H', this.currentConfig.clearHeight.toString());
        
        const pitDepthValue = this.elements.pitDepth.value;
        if (pitDepthValue) {
            urlParams.set('PD', pitDepthValue);
        }
        
        const platformWidthValue = this.elements.platformWidth.value;
        if (platformWidthValue) {
            const cmMatch = platformWidthValue.match(/W(\d+)/);
            if (cmMatch) {
                urlParams.set('W', cmMatch[1]);
            }
        }
        
        const platformLengthValue = this.elements.platformLength.value;
        if (platformLengthValue) {
            const cmMatch = platformLengthValue.match(/(PL|NL)(\d+)/);
            if (cmMatch) {
                urlParams.set('L', cmMatch[2]);
            }
        }
        
        const newURL = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.pushState({}, '', newURL);
    }
    
    // System Type Section
    populateSystemTypeOptions() {
        this.elements.systemType.innerHTML = '';
        const systemTypes = ['TrendVario 6100', 'TrendVario 6200', 'TrendVario 6300'];
        
        systemTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            this.elements.systemType.appendChild(option);
        });
        
        this.elements.systemType.value = this.currentConfig.systemType;
    }
    
    // Clear Height Section
    populateClearHeightOptions() {
        this.elements.clearHeight.innerHTML = '';
        
        if (this.systemData.heights && this.systemData.heights[this.currentConfig.systemType]) {
            const heightData = this.systemData.heights[this.currentConfig.systemType];
            
            if (heightData && heightData.H) {
                const cmValues = heightData.H.cm || [];
                const inValues = heightData.H.in || [];
                const ftInValues = heightData.H['ft-in'] || [];
                
                cmValues.forEach((cmValue, index) => {
                    const option = document.createElement('option');
                    option.value = cmValue;
                    
                    const ftInValue = ftInValues[index] || '';
                    const inValue = inValues[index] || '';
                    
                    const displayText = `${ftInValue} (${inValue}) ${cmValue}cm`;
                    option.textContent = displayText;
                    
                    this.elements.clearHeight.appendChild(option);
                });
                
                const systemNumber = this.currentConfig.systemType.split(' ')[1];
                let defaultHeight;
                
                switch (systemNumber) {
                    case '6300':
                        defaultHeight = '375';
                        break;
                    case '6200':
                        defaultHeight = '380';
                        break;
                    case '6100':
                        defaultHeight = '225';
                        break;
                    default:
                        defaultHeight = cmValues[0];
                }
                
                if (cmValues.includes(defaultHeight)) {
                    this.elements.clearHeight.value = defaultHeight;
                    this.currentConfig.clearHeight = parseInt(defaultHeight);
                } else if (cmValues.length > 0) {
                    this.elements.clearHeight.value = cmValues[0];
                    this.currentConfig.clearHeight = parseInt(cmValues[0]);
                }
            }
        }
    }
    
    updateClearHeightDisplay() {
        const selectedHeight = this.elements.clearHeight.value;
        const display1 = this.elements.clearHeight.parentNode.querySelector('.clear-height-display-1');
        const display2 = this.elements.clearHeight.parentNode.querySelector('.clear-height-display-2');
        const display3 = this.elements.clearHeight.parentNode.querySelector('.clear-height-display-3');
        const display4 = this.elements.clearHeight.parentNode.querySelector('.clear-height-display-4');
        
        const selectedRadio = document.querySelector('input[name="numRows"]:checked');
        const numRows = selectedRadio ? parseInt(selectedRadio.value) : 1;
        
        if (selectedHeight && this.systemData.heights) {
            const systemType = this.elements.systemType.value;
            const heightData = this.systemData.heights[systemType];
            
            if (heightData) {
                const hIndex = heightData.H && heightData.H.cm ? heightData.H.cm.indexOf(selectedHeight) : -1;
                
                if (hIndex !== -1) {
                    const ulValue = heightData.UL && heightData.UL.cm ? heightData.UL.cm[hIndex] : '';
                    const glValue = heightData.GL && heightData.GL.cm ? heightData.GL.cm[hIndex] : '';
                    const llValue = heightData.LL && heightData.LL.cm ? heightData.LL.cm[hIndex] : '';
                    const lldoValue = heightData.LLDO && heightData.LLDO.cm ? heightData.LLDO.cm[hIndex] : '';
                    
                    this.currentDimensions.UL = ulValue ? parseFloat(ulValue) : null;
                    this.currentDimensions.GL = glValue ? parseFloat(glValue) : null;
                    
                    this.notifyDimensionsChange();
                    
                    // Display 1: UL
                    if (display1) {
                        const systemType = this.elements.systemType.value;
                        if (systemType === 'TrendVario 6100') {
                            display1.style.backgroundColor = '#FFECEC';
                            display1.innerHTML = `<div class="dimension-display"><div class="dimension-primary">UL - N/A - No Upper Level</div></div>`;
                        } else if (ulValue && ulValue.trim() !== '') {
                            const ulFtIn = heightData.UL['ft-in'] ? heightData.UL['ft-in'][hIndex] : '';
                            const ulIn = heightData.UL.in ? heightData.UL.in[hIndex] : '';
                            display1.style.backgroundColor = '';
                            display1.innerHTML = `<div class="dimension-display"><div class="dimension-primary">UL - ${ulFtIn} (${ulIn}) ${ulValue}cm</div></div>`;
                        } else {
                            display1.innerHTML = '';
                        }
                    }
                    
                    // Display 2: GL
                    if (display2) {
                        if (glValue && glValue.trim() !== '') {
                            const glFtIn = heightData.GL['ft-in'] ? heightData.GL['ft-in'][hIndex] : '';
                            const glIn = heightData.GL.in ? heightData.GL.in[hIndex] : '';
                            display2.innerHTML = `<div class="dimension-display"><div class="dimension-primary">GL - ${glFtIn} (${glIn}) ${glValue}cm</div></div>`;
                        } else {
                            display2.innerHTML = '';
                        }
                    }
                    
                    // Display 3: LL
                    if (display3) {
                        const systemType = this.elements.systemType.value;
                        if (systemType === 'TrendVario 6200') {
                            display3.style.backgroundColor = '#FFECEC';
                            display3.innerHTML = `<div class="dimension-display"><div class="dimension-primary">Max LL - N/A - No Pit</div></div>`;
                        } else if (llValue && llValue.trim() !== '') {
                            const llFtIn = heightData.LL['ft-in'] ? heightData.LL['ft-in'][hIndex] : '';
                            const llIn = heightData.LL.in ? heightData.LL.in[hIndex] : '';
                            display3.style.backgroundColor = '';
                            display3.innerHTML = `<div class="dimension-display"><div class="dimension-primary">Max LL - ${llFtIn} (${llIn}) ${llValue}cm</div></div>`;
                        } else {
                            display3.innerHTML = '';
                        }
                    }
                    
                    // Display 4: LLDO
                    if (display4 && numRows > 1) {
                        const systemType = this.elements.systemType.value;
                        if (systemType === 'TrendVario 6200') {
                            display4.style.display = 'none';
                            display4.innerHTML = '';
                        } else if (lldoValue && lldoValue.trim() !== '') {
                            const lldoFtIn = heightData.LLDO['ft-in'] ? heightData.LLDO['ft-in'][hIndex] : '';
                            const lldoIn = heightData.LLDO.in ? heightData.LLDO.in[hIndex] : '';
                            display4.style.backgroundColor = '';
                            display4.innerHTML = `<div class="dimension-display"><div class="dimension-primary">Max LLDO - ${lldoFtIn} (${lldoIn}) ${lldoValue}cm</div></div>`;
                            display4.style.display = 'block';
                        } else {
                            display4.style.display = 'none';
                            display4.innerHTML = '';
                        }
                    } else if (display4) {
                        display4.style.display = 'none';
                        display4.innerHTML = '';
                    }
                }
            }
        } else {
            if (display1) display1.innerHTML = '';
            if (display2) display2.innerHTML = '';
            if (display3) display3.innerHTML = '';
            if (display4) display4.innerHTML = '';
        }
        
        if (display4) {
            const systemType = this.elements.systemType.value;
            if (systemType === 'TrendVario 6200') {
                display4.style.display = 'none';
                display4.innerHTML = '';
            } else if (numRows > 1) {
                display4.style.display = 'block';
            } else {
                display4.style.display = 'none';
                display4.innerHTML = '';
            }
        }
    }
    
    // Pit Depth Section
    populatePitDepthOptions() {
        this.elements.pitDepth.innerHTML = '';
        
        if (this.systemData.pitDepths && this.systemData.pitDepths[this.currentConfig.systemType]) {
            const pitDepthData = this.systemData.pitDepths[this.currentConfig.systemType];
            
            if (pitDepthData && pitDepthData.PD) {
                const cmValues = pitDepthData.PD.cm || [];
                const inValues = pitDepthData.PD.in || [];
                const ftInValues = pitDepthData.PD['ft-in'] || [];
                
                cmValues.forEach((cmValue, index) => {
                    const option = document.createElement('option');
                    option.value = cmValue;
                    
                    const ftInValue = ftInValues[index] || '';
                    const inValue = inValues[index] || '';
                    
                    const displayText = `${ftInValue} (${inValue}) ${cmValue}cm`;
                    option.textContent = displayText;
                    
                    this.elements.pitDepth.appendChild(option);
                });
                
                if (cmValues.length > 0) {
                    this.elements.pitDepth.value = cmValues[0];
                    this.currentConfig.pitDepth = cmValues[0];
                }
            }
        }
    }
    
    updatePitDepthDisplay() {
        const selectedPitDepth = this.elements.pitDepth.value;
        const display1 = this.elements.pitDepth.parentNode.querySelector('.pit-depth-display-1');
        const display2 = this.elements.pitDepth.parentNode.querySelector('.pit-depth-display-2');
        
        const selectedRadio = document.querySelector('input[name="numRows"]:checked');
        const numRows = selectedRadio ? parseInt(selectedRadio.value) : 1;
        
        if (selectedPitDepth && this.systemData.pitDepths) {
            const systemType = this.elements.systemType.value;
            const pitDepthData = this.systemData.pitDepths[systemType];
            
            if (pitDepthData) {
                const pdIndex = pitDepthData.PD && pitDepthData.PD.cm ? pitDepthData.PD.cm.indexOf(selectedPitDepth) : -1;
                
                if (pdIndex !== -1) {
                    const llValue = pitDepthData.LL && pitDepthData.LL.cm ? pitDepthData.LL.cm[pdIndex] : '';
                    const lldoValue = pitDepthData.LLDO && pitDepthData.LLDO.cm ? pitDepthData.LLDO.cm[pdIndex] : '';
                    
                    this.currentDimensions.LL = llValue ? parseFloat(llValue) : null;
                    this.currentDimensions.LLDO = lldoValue ? parseFloat(lldoValue) : null;
                    
                    this.notifyDimensionsChange();
                    
                    // Display 1: LL
                    if (display1) {
                        const systemType = this.elements.systemType.value;
                        if (systemType === 'TrendVario 6200') {
                            display1.style.backgroundColor = '#FFECEC';
                            display1.innerHTML = `<div class="dimension-display"><div class="dimension-primary">LL - N/A - No Pit</div></div>`;
                        } else if (llValue && llValue.trim() !== '') {
                            const llFtIn = pitDepthData.LL['ft-in'] ? pitDepthData.LL['ft-in'][pdIndex] : '';
                            const llIn = pitDepthData.LL.in ? pitDepthData.LL.in[pdIndex] : '';
                            display1.style.backgroundColor = '';
                            display1.innerHTML = `<div class="dimension-display"><div class="dimension-primary">LL - ${llFtIn} (${llIn}) ${llValue}cm</div></div>`;
                        } else {
                            display1.innerHTML = '';
                        }
                    }
                    
                    // Display 2: LLDO
                    if (display2 && numRows > 1) {
                        const systemType = this.elements.systemType.value;
                        if (systemType === 'TrendVario 6200') {
                            display2.style.display = 'none';
                            display2.innerHTML = '';
                        } else if (lldoValue && lldoValue.trim() !== '') {
                            const lldoFtIn = pitDepthData.LLDO['ft-in'] ? pitDepthData.LLDO['ft-in'][pdIndex] : '';
                            const lldoIn = pitDepthData.LLDO.in ? pitDepthData.LLDO.in[pdIndex] : '';
                            display2.style.backgroundColor = '';
                            display2.innerHTML = `<div class="dimension-display"><div class="dimension-primary">LLDO - ${lldoFtIn} (${lldoIn}) ${lldoValue}cm</div></div>`;
                            display2.style.display = 'block';
                        } else {
                            display2.style.display = 'none';
                            display2.innerHTML = '';
                        }
                    } else if (display2) {
                        display2.style.display = 'none';
                        display2.innerHTML = '';
                    }
                }
            }
        } else {
            if (display1) display1.innerHTML = '';
            if (display2) display2.innerHTML = '';
        }
        
        if (display2) {
            const systemType = this.elements.systemType.value;
            if (systemType === 'TrendVario 6200') {
                display2.style.display = 'none';
                display2.innerHTML = '';
            } else if (numRows > 1) {
                display2.style.display = 'block';
            } else {
                display2.style.display = 'none';
                display2.innerHTML = '';
            }
        }
    }
    
    // Platform Width Section
    populatePlatformWidthOptions() {
        this.elements.platformWidth.innerHTML = '';
        
        if (this.systemData.widths && this.systemData.widths[this.currentConfig.systemType]) {
            const widthData = this.systemData.widths[this.currentConfig.systemType];
            
            if (widthData && widthData.W) {
                const options = widthData.W.options || [];
                
                options.forEach(optionText => {
                    const option = document.createElement('option');
                    option.value = optionText;
                    option.textContent = optionText;
                    this.elements.platformWidth.appendChild(option);
                });
                
                if (options.length > 0) {
                    this.elements.platformWidth.value = options[0];
                    this.currentConfig.platformWidth = options[0];
                }
            }
        }
    }
    
    updatePlatformWidthDisplay() {
        const selectedWidth = this.elements.platformWidth.value;
        const display1 = this.elements.platformWidth.parentNode.querySelector('.platform-width-display-1');
        const display2 = this.elements.platformWidth.parentNode.querySelector('.platform-width-display-2');
        
        if (selectedWidth && this.systemData.widths) {
            const systemType = this.elements.systemType.value;
            const widthData = this.systemData.widths[systemType];
            
            if (widthData) {
                const cmMatch = selectedWidth.match(/W(\d+)/);
                if (cmMatch) {
                    const widthIndex = widthData.W.options ? widthData.W.options.indexOf(selectedWidth) : -1;
                    
                    if (widthIndex !== -1) {
                        const scwCm = widthData.SCW && widthData.SCW.cm ? widthData.SCW.cm[widthIndex] : '';
                        const scwIn = widthData.SCW && widthData.SCW.in ? widthData.SCW.in[widthIndex] : '';
                        const scwFtIn = widthData.SCW && widthData.SCW['ft-in'] ? widthData.SCW['ft-in'][widthIndex] : '';
                        
                        this.currentDimensions.clearWidth = scwCm ? parseFloat(scwCm) : null;
                        this.notifyDimensionsChange();
                        
                        if (display1) {
                            display1.innerHTML = `<div class="dimension-display"><div class="dimension-primary">Stall Clear Width - ${scwFtIn} (${scwIn}) ${scwCm}cm</div></div>`;
                        }
                        
                        if (display2) {
                            const swCm = widthData.SW && widthData.SW.cm ? widthData.SW.cm[widthIndex] : '';
                            const swIn = widthData.SW && widthData.SW.in ? widthData.SW.in[widthIndex] : '';
                            const swFtIn = widthData.SW && widthData.SW['ft-in'] ? widthData.SW['ft-in'][widthIndex] : '';
                            display2.innerHTML = `<div class="dimension-display"><div class="dimension-primary">Stall Width - ${swFtIn} (${swIn}) ${swCm}cm</div></div>`;
                        }
                    }
                }
            }
        } else {
            if (display1) display1.innerHTML = '';
            if (display2) display2.innerHTML = '';
        }
    }
    
    // Platform Length Section
    populatePlatformLengthOptions() {
        this.elements.platformLength.innerHTML = '';
        
        if (this.systemData.lengths && this.systemData.lengths[this.currentConfig.systemType]) {
            const lengthData = this.systemData.lengths[this.currentConfig.systemType];
            
            // Combine PL and NL options
            const plOptions = lengthData.PL ? lengthData.PL.options || [] : [];
            const nlOptions = lengthData.NL ? lengthData.NL.options || [] : [];
            const allOptions = [...plOptions, ...nlOptions];
            
            allOptions.forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                this.elements.platformLength.appendChild(option);
            });
        }
    }
    
    updatePlatformLengthDisplay() {
        const selectedLength = this.elements.platformLength.value;
        const display1 = this.elements.platformLength.parentNode.querySelector('.platform-length-display-1');
        const display2 = this.elements.platformLength.parentNode.querySelector('.platform-length-display-2');
        
        if (selectedLength && this.systemData.lengths) {
            const systemType = this.elements.systemType.value;
            const lengthData = this.systemData.lengths[systemType];
            
            if (lengthData) {
                const isPL = selectedLength.startsWith('PL');
                const lengthType = isPL ? 'PL' : 'NL';
                const lengthIndex = lengthData[lengthType] && lengthData[lengthType].options ? lengthData[lengthType].options.indexOf(selectedLength) : -1;
                
                if (lengthIndex !== -1) {
                    const slCm = lengthData.SL && lengthData.SL.cm ? lengthData.SL.cm[lengthIndex] : '';
                    const slIn = lengthData.SL && lengthData.SL.in ? lengthData.SL.in[lengthIndex] : '';
                    const slFtIn = lengthData.SL && lengthData.SL['ft-in'] ? lengthData.SL['ft-in'][lengthIndex] : '';
                    
                    if (display1) {
                        display1.innerHTML = `<div class="dimension-display"><div class="dimension-primary">Stall Length - ${slFtIn} (${slIn}) ${slCm}cm</div></div>`;
                    }
                    
                    const mvCm = lengthData.MV && lengthData.MV.cm ? lengthData.MV.cm[lengthIndex] : '';
                    const mvIn = lengthData.MV && lengthData.MV.in ? lengthData.MV.in[lengthIndex] : '';
                    const mvFtIn = lengthData.MV && lengthData.MV['ft-in'] ? lengthData.MV['ft-in'][lengthIndex] : '';
                    
                    this.currentDimensions.maxVehicle = mvCm ? parseFloat(mvCm) : null;
                    this.notifyDimensionsChange();
                    
                    if (display2) {
                        display2.innerHTML = `<div class="dimension-display"><div class="dimension-primary">Max Vehicle Length - ${mvFtIn} (${mvIn}) ${mvCm}cm</div></div>`;
                    }
                }
            }
        } else {
            if (display1) display1.innerHTML = '';
            if (display2) display2.innerHTML = '';
        }
    }
    
    // Grid Options
    populateGridOptions() {
        this.elements.numGrids.innerHTML = '<option value="">Select Grids</option>';
        
        for (let i = 2; i <= 15; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i.toString();
            this.elements.numGrids.appendChild(option);
        }
        
        this.elements.numGrids.value = this.currentConfig.numGrids;
    }
    
    setupEventListeners() {
        // System type change
        this.elements.systemType.addEventListener('change', () => {
            this.currentConfig.systemType = this.elements.systemType.value;
            this.populateClearHeightOptions();
            this.populatePitDepthOptions();
            this.populatePlatformWidthOptions();
            this.populatePlatformLengthOptions();
            this.updateClearHeightDisplay();
            this.updatePitDepthDisplay();
            this.updatePlatformWidthDisplay();
            this.updatePlatformLengthDisplay();
            this.updateField1Calculation();
            this.saveToURL();
        });
        
        // Number of rows change
        document.querySelectorAll('input[name="numRows"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.currentConfig.numRows = parseInt(radio.value);
                this.updateClearHeightDisplay();
                this.updatePitDepthDisplay();
                this.updateField1Calculation();
                this.saveToURL();
            });
        });
        
        // Number of grids change
        this.elements.numGrids.addEventListener('change', () => {
            this.currentConfig.numGrids = parseInt(this.elements.numGrids.value);
            this.updateField1Calculation();
            this.saveToURL();
        });
        
        // Clear height change
        this.elements.clearHeight.addEventListener('change', () => {
            this.currentConfig.clearHeight = parseInt(this.elements.clearHeight.value);
            this.updateClearHeightDisplay();
            this.saveToURL();
        });
        
        // Pit depth change
        this.elements.pitDepth.addEventListener('change', () => {
            this.currentConfig.pitDepth = this.elements.pitDepth.value;
            this.updatePitDepthDisplay();
            this.saveToURL();
        });
        
        // Platform width change
        this.elements.platformWidth.addEventListener('change', () => {
            this.currentConfig.platformWidth = this.elements.platformWidth.value;
            this.updatePlatformWidthDisplay();
            this.saveToURL();
        });
        
        // Platform length change
        this.elements.platformLength.addEventListener('change', () => {
            this.currentConfig.platformLength = this.elements.platformLength.value;
            this.updatePlatformLengthDisplay();
            this.saveToURL();
        });
    }
}

// VehicleList Application - Uses JSON Data
class VehicleList {
    constructor() {
        this.vehicles = [];
        this.filteredVehicles = [];
        this.currentPage = 0;
        this.itemsPerPage = 50;
        this.isLoading = false;
        this.hasMoreData = true;
        this.sortField = null;
        this.sortDirection = 'asc';
        this.configureSystem = null;
        this.initializeElements();
        this.setupEventListeners();
        this.loadVehicleData();
    }
    
    initializeElements() {
        this.elements = {
            vehicleTbody: document.getElementById('vehicle-tbody')
        };
    }
    
    setConfigureSystem(configureSystem) {
        this.configureSystem = configureSystem;
    }
    
    refreshDisplay() {
        this.resetPagination();
        this.renderVehicleTable();
    }
    
    setupEventListeners() {
        window.addEventListener('scroll', () => this.handleScroll());
        
        document.querySelectorAll('.m3-vehicle-sortable').forEach(header => {
            header.addEventListener('click', (e) => this.handleSort(e.target.dataset.sort));
        });
    }
    
    async loadVehicleData() {
        try {
            const response = await fetch('assets/json/vehicles.json');
            this.vehicles = await response.json();
            this.applyFilters();
        } catch (error) {
            console.error('Error loading vehicle data:', error);
            this.showError('Failed to load vehicle data');
        }
    }
    
    applyFilters() {
        this.filteredVehicles = this.vehicles.filter(() => true);
        
        if (this.sortField) this.sortVehicles();
        
        this.resetPagination();
        this.renderVehicleTable();
    }
    
    getStatus(maxAllowedValue, vehicleValue) {
        if (!maxAllowedValue || !vehicleValue) return '✅';
        
        const vehicleNum = parseFloat(vehicleValue);
        const maxNum = parseFloat(maxAllowedValue);
        
        return (isNaN(vehicleNum) || isNaN(maxNum)) ? '✅' : (vehicleNum > maxNum ? '❌' : '✅');
    }
    
    getULStatus(vehicle) {
        const maxValue = this.configureSystem?.currentDimensions?.UL;
        return this.getStatus(maxValue, vehicle.height?.cm);
    }
    
    getGLStatus(vehicle) {
        const maxValue = this.configureSystem?.currentDimensions?.GL;
        return this.getStatus(maxValue, vehicle.height?.cm);
    }
    
    getLLStatus(vehicle) {
        const maxValue = this.configureSystem?.currentDimensions?.LL;
        return this.getStatus(maxValue, vehicle.height?.cm);
    }
    
    getLLDOStatus(vehicle) {
        const maxValue = this.configureSystem?.currentDimensions?.LLDO;
        return this.getStatus(maxValue, vehicle.height?.cm);
    }
    
    getWStatus(vehicle) {
        const maxValue = this.configureSystem?.currentDimensions?.clearWidth;
        return this.getStatus(maxValue, vehicle.width?.cm);
    }
    
    getLStatus(vehicle) {
        const maxValue = this.configureSystem?.currentDimensions?.maxVehicle;
        return this.getStatus(maxValue, vehicle.length?.cm);
    }
    
    handleSort(field) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        
        this.updateSortHeaders();
        this.sortVehicles();
        this.resetPagination();
        this.renderVehicleTable();
    }
    
    updateSortHeaders() {
        document.querySelectorAll('.m3-vehicle-sortable').forEach(header => {
            header.classList.remove('asc', 'desc');
        });
        
        if (this.sortField) {
            const currentHeader = document.querySelector(`[data-sort="${this.sortField}"]`);
            currentHeader?.classList.add(this.sortDirection);
        }
    }
    
    sortVehicles() {
        if (!this.sortField) return;
        
        const getValue = (vehicle, field) => {
            switch (field) {
                case 'make': return vehicle.make?.toLowerCase() || '';
                case 'model': return vehicle.model?.toLowerCase() || '';
                case 'year': return parseInt(vehicle.year) || 0;
                case 'height': return parseFloat(vehicle.height?.cm) || 0;
                case 'width': return parseFloat(vehicle.width?.cm) || 0;
                case 'length': return parseFloat(vehicle.length?.cm) || 0;
                case 'weight': return parseFloat(vehicle.weight) || 0;
                default: return '';
            }
        };
        
        this.filteredVehicles.sort((a, b) => {
            const aValue = getValue(a, this.sortField);
            const bValue = getValue(b, this.sortField);
            
            if (this.sortDirection === 'asc') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            }
        });
    }
    
    resetPagination() {
        this.currentPage = 0;
        this.hasMoreData = this.filteredVehicles.length > 0;
    }
    
    handleScroll() {
        if (this.isLoading || !this.hasMoreData) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        if (scrollTop + windowHeight >= documentHeight - 200) {
            this.loadMoreVehicles();
        }
    }
    
    loadMoreVehicles() {
        if (this.isLoading || !this.hasMoreData) return;
        
        this.isLoading = true;
        
        const startIndex = this.currentPage * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const vehiclesToAdd = this.filteredVehicles.slice(startIndex, endIndex);
        
        if (vehiclesToAdd.length > 0) {
            this.appendVehiclesToTable(vehiclesToAdd);
            this.currentPage++;
            this.hasMoreData = endIndex < this.filteredVehicles.length;
        } else {
            this.hasMoreData = false;
        }
        
        this.isLoading = false;
    }
    
    renderVehicleTable() {
        if (!this.elements.vehicleTbody) return;
        
        this.elements.vehicleTbody.innerHTML = '';
        
        if (this.filteredVehicles.length === 0) {
            this.elements.vehicleTbody.innerHTML = `
                <tr>
                    <td colspan="13" style="text-align: center; padding: 40px; color: #666;">
                        No vehicles found.
                    </td>
                </tr>
            `;
            return;
        }
        
        this.loadMoreVehicles();
    }
    
    appendVehiclesToTable(vehicles) {
        if (!this.elements.vehicleTbody) return;
        
        this.elements.vehicleTbody.querySelector('.loading-indicator')?.remove();
        
        vehicles.forEach(vehicle => {
            const row = this.createVehicleRow(vehicle);
            this.elements.vehicleTbody.appendChild(row);
        });
        
        const endIndex = (this.currentPage + 1) * this.itemsPerPage;
        if (endIndex < this.filteredVehicles.length) {
            this.addLoadingIndicator();
        }
    }
    
    addLoadingIndicator() {
        const loadingRow = document.createElement('tr');
        loadingRow.className = 'loading-indicator';
        loadingRow.innerHTML = `
            <td colspan="13" style="text-align: center; padding: 20px; color: #666;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <div class="loading-spinner"></div>
                    Loading more vehicles...
                </div>
            </td>
        `;
        this.elements.vehicleTbody.appendChild(loadingRow);
    }
    
    createVehicleRow(vehicle) {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${this.escapeHtml(vehicle.make || '')}</td>
            <td>${this.escapeHtml(vehicle.model || '')}</td>
            <td>${this.escapeHtml(vehicle.year || '')}</td>
            <td>
                <div class="dimension-value">
                    <div class="dimension-primary">${this.formatDimension(vehicle.height)}</div>
                    <div class="dimension-secondary">${vehicle.height?.cm || ''}cm</div>
                </div>
            </td>
            <td>${this.getULStatus(vehicle)}</td>
            <td>${this.getGLStatus(vehicle)}</td>
            <td>${this.getLLStatus(vehicle)}</td>
            <td>${this.getLLDOStatus(vehicle)}</td>
            <td>
                <div class="dimension-value">
                    <div class="dimension-primary">${this.formatDimension(vehicle.width)}</div>
                    <div class="dimension-secondary">${vehicle.width?.cm || ''}cm</div>
                </div>
            </td>
            <td>${this.getWStatus(vehicle)}</td>
            <td>
                <div class="dimension-value">
                    <div class="dimension-primary">${this.formatDimension(vehicle.length)}</div>
                    <div class="dimension-secondary">${vehicle.length?.cm || ''}cm</div>
                </div>
            </td>
            <td>${this.getLStatus(vehicle)}</td>
            <td>
                <div class="dimension-value">
                    <div class="dimension-primary">${this.formatWeight(vehicle.weight)}</div>
                </div>
            </td>
        `;
        
        return row;
    }
    
    formatDimension(dimension) {
        if (!dimension) return 'N/A';
        if (dimension.ftIn?.trim()) return dimension.ftIn;
        if (dimension.in?.trim()) return `${dimension.in}"`;
        if (dimension.cm?.trim()) return `${dimension.cm}cm`;
        return 'N/A';
    }
    
    formatWeight(weight) {
        return weight?.trim() ? `${weight} lbs` : 'N/A';
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }
    
    showError(message) {
        if (this.elements.vehicleTbody) {
            this.elements.vehicleTbody.innerHTML = `
                <tr>
                    <td colspan="13" style="text-align: center; padding: 40px; color: #dc3545;">
                        Error: ${message}
                    </td>
                </tr>
            `;
        }
    }
}

// Initialize both applications when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const configureSystem = new ConfigureSystem();
    const vehicleList = new VehicleList();
    
    vehicleList.setConfigureSystem(configureSystem);
    
    configureSystem.onDimensionsChange = () => {
        vehicleList.refreshDisplay();
    };
});

