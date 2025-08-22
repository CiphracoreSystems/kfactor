// Example of how to modify your drawDiagram function to use the debug logger

function drawDiagram(scale) {
    // Log the function call with parameters
    window.debugFunction('drawDiagram', { scale: scale });
    
    // Log the specific scale value you want to track
    window.debugScale(scale, {
        type: typeof scale,
        isValid: !isNaN(scale),
        timestamp: new Date().toISOString()
    });
    
    // Your existing diagram drawing code here...
    // Log key steps in your diagram drawing process
    
    try {
        // Example of logging calculation steps
        const canvasWidth = 800;
        const scaledWidth = canvasWidth * scale;
        window.debugLog(`Canvas width: ${canvasWidth}, Scaled width: ${scaledWidth}`, 'calculation');
        
        // Your actual drawing code...
        
        // Log successful completion
        window.debugLog(`✅ Diagram drawn successfully with scale ${scale}`, 'success');
        
    } catch (error) {
        // Log any errors
        window.debugLog(`❌ Error drawing diagram: ${error.message}`, 'error');
        throw error;
    }
}

// Example of logging user input events
function onScaleInputChange(inputElement) {
    const newScale = parseFloat(inputElement.value);
    window.debugLog(`Scale input changed to: ${newScale}`, 'input');
    
    // Validate the input
    if (isNaN(newScale)) {
        window.debugLog(`⚠️ Invalid scale value: "${inputElement.value}"`, 'warning');
        return;
    }
    
    // Call your diagram function
    drawDiagram(newScale);
}

// Example of logging button clicks
function onRedrawButtonClick() {
    window.debugLog('🔄 Redraw button clicked', 'interaction');
    
    // Get current scale value
    const scaleInput = document.getElementById('scaleInput'); // adjust ID as needed
    const currentScale = parseFloat(scaleInput.value) || 1.0;
    
    window.debugLog(`Using scale value: ${currentScale}`, 'info');
    drawDiagram(currentScale);
}

// You can also add general debugging for any calculations
function calculateSomething(param1, param2) {
    window.debugFunction('calculateSomething', { param1, param2 });
    
    const result = param1 * param2;
    window.debugLog(`Calculation: ${param1} * ${param2} = ${result}`, 'calculation');
    
    return result;
}

// Example of debugging form submissions or data processing
function processFormData(formData) {
    window.debugLog('📋 Processing form data', 'form');
    
    // Log each form field
    for (let [key, value] of formData.entries()) {
        window.debugLog(`Form field ${key}: ${value}`, 'input');
    }
}