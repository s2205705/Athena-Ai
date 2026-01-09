class AthenaStudyAI {
    constructor() {
        this.systemStatus = 'operational';
        this.studySession = {
            active: false,
            startTime: null,
            duration: 0,
            topics: [],
            retentionScore: 84
        };
        this.conversationHistory = [];
        this.responseDepth = 3; // 1-5 scale
        this.adaptiveLearning = true;
        this.knowledgeAreas = new Set(['mathematics', 'programming', 'science', 'literature']);
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSystemUI();
        this.startSystemClock();
        this.loadUserPreferences();
        
        // Initial system greeting
        setTimeout(() => {
            this.speak("Athena Study Assistant initialized. All systems operational. Ready to assist with your academic pursuits.");
            this.updateSystemMessage("System initialized. How may I assist your studies today?");
        }, 1000);
    }

    setupEventListeners() {
        // Send button
        document.getElementById('send-btn').addEventListener('click', () => this.handleUserQuery());
        
        // Enter key in input
        document.getElementById('user-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserQuery();
            }
        });
        
        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Study controls
        document.getElementById('focus-mode').addEventListener('click', () => this.toggleFocusMode());
        document.getElementById('record-session').addEventListener('click', () => this.toggleRecording());
        
        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());
        document.getElementById('close-settings').addEventListener('click', () => this.hideSettings());
        document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
        
        // Modal close on click outside
        document.getElementById('settings-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.hideSettings();
        });
        
        // Footer buttons
        document.getElementById('help-btn').addEventListener('click', () => this.showDocumentation());
        document.getElementById('export-btn').addEventListener('click', () => this.exportData());
        document.getElementById('analytics-btn').addEventListener('click', () => this.showAnalytics());
        
        // Input options
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.setInputType(type);
            });
        });
        
        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => this.clearCurrentQuery());
    }

    handleUserQuery() {
        const input = document.getElementById('user-input');
        const text = input.value.trim();
        
        if (!text) return;
        
        this.addMessage(text, 'user');
        this.processStudyQuery(text);
        input.value = '';
        
        // Start study session if not active
        if (!this.studySession.active) {
            this.startStudySession();
        }
    }

    processStudyQuery(query) {
        query = query.toLowerCase();
        
        // Add to conversation history
        this.conversationHistory.push({
            user: query,
            time: new Date(),
            type: 'query'
        });
        
        // Process based on query type
        let response = this.generateStudyResponse(query);
        
        // Add AI response
        this.addMessage(response, 'ai');
        
        // Update system metrics
        this.updateStudyMetrics(query);
        
        // Speak response if enabled
        if (this.getPreference('voiceResponses')) {
            this.speak(response);
        }
    }

    generateStudyResponse(query) {
        // Academic response generation
        if (this.isMathematicsQuery(query)) {
            return this.generateMathResponse(query);
        }
        
        if (this.isProgrammingQuery(query)) {
            return this.generateProgrammingResponse(query);
        }
        
        if (this.isScienceQuery(query)) {
            return this.generateScienceResponse(query);
        }
        
        if (this.isLiteratureQuery(query)) {
            return this.generateLiteratureResponse(query);
        }
        
        // Study assistance queries
        if (query.includes('explain') || query.includes('what is')) {
            return this.generateExplanation(query);
        }
        
        if (query.includes('how to') || query.includes('steps')) {
            return this.generateProcedure(query);
        }
        
        if (query.includes('difference between') || query.includes('compare')) {
            return this.generateComparison(query);
        }
        
        if (query.includes('example') || query.includes('demonstrate')) {
            return this.generateExample(query);
        }
        
        // System queries
        if (query.includes('help') || query.includes('assist')) {
            return "I can help with:\n1. Conceptual explanations\n2. Problem solving\n3. Code analysis\n4. Research assistance\n5. Study planning\n6. Data interpretation\n\nPlease specify your academic need.";
        }
        
        // Default academic response
        const responses = [
            "Based on my analysis, this topic requires careful consideration of fundamental principles. Would you like me to provide a structured explanation?",
            "This query involves multiple aspects. I recommend breaking it down into components for systematic analysis.",
            "My database contains relevant information on this subject. Shall I provide a comprehensive overview?",
            "This appears to be an advanced topic. Would you like a foundational explanation first, or shall I proceed directly to complex aspects?",
            "I can assist with this through several approaches:\n- Theoretical framework\n- Practical applications\n- Historical context\n- Current research trends\n\nWhich perspective would be most helpful?"
        ];
        
        return this.randomChoice(responses);
    }

    isMathematicsQuery(query) {
        const mathTerms = ['calculate', 'solve', 'equation', 'formula', 'derivative', 'integral', 'matrix', 'vector', 'algebra', 'calculus'];
        return mathTerms.some(term => query.includes(term));
    }

    generateMathResponse(query) {
        const responses = [
            "Mathematical analysis suggests:\n```\nLet x be the variable in question.\nApplying fundamental theorem of calculus:\n∫ f(x) dx from a to b = F(b) - F(a)\nWhere F is the antiderivative of f.\n```\nWould you like a step-by-step derivation?",
            "This mathematical problem requires consideration of:\n1. Initial conditions\n2. Boundary constraints\n3. Convergence properties\n4. Numerical stability\n\nI can provide a solution algorithm.",
            "For this mathematical concept:\n- Domain: ℝ (all real numbers)\n- Range: Depends on function properties\n- Critical points: Where f'(x) = 0\n- Inflection points: Where f''(x) = 0\n\nShall I elaborate on any specific aspect?",
            "Mathematical framework:\n```python\nimport numpy as np\n# Vector space operations\ndef vector_operations(v1, v2):\n    dot_product = np.dot(v1, v2)\n    cross_product = np.cross(v1, v2)\n    return dot_product, cross_product\n```\nThis demonstrates fundamental vector operations."
        ];
        
        return this.randomChoice(responses);
    }

    generateProgrammingResponse(query) {
        const codeExamples = {
            python: "```python\n# Efficient algorithm implementation\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n```\nTime Complexity: O(log n)",
            javascript: "```javascript\n// Asynchronous data processing\nasync function processData(url) {\n    try {\n        const response = await fetch(url);\n        const data = await response.json();\n        return data.map(item => ({\n            ...item,\n            processed: true,\n            timestamp: Date.now()\n        }));\n    } catch (error) {\n        console.error('Processing error:', error);\n        throw error;\n    }\n}\n```",
            algorithm: "Algorithm Analysis:\n\n1. **Input**: Problem parameters\n2. **Process**:\n   - Divide into subproblems\n   - Solve recursively\n   - Combine solutions\n3. **Output**: Optimal solution\n\nTime Complexity: O(n log n)\nSpace Complexity: O(n)"
        };
        
        const response = "Programming analysis complete. Key considerations:\n\n- **Architecture**: Modular design recommended\n- **Complexity**: Consider time/space tradeoffs\n- **Testing**: Implement unit tests\n- **Documentation**: Maintain clear comments\n\n" + codeExamples.python;
        
        return response;
    }

    generateExplanation(query) {
        const explanations = [
            "**Conceptual Framework**:\n\nThis concept operates within a theoretical framework established by foundational research. The core principles involve:\n1. Fundamental axioms\n2. Derived theorems\n3. Practical applications\n4. Limitations and boundaries\n\n**Key Insight**: Understanding the historical development of this concept provides context for modern applications.",
            "**Detailed Explanation**:\n\nLet me break this down systematically:\n\n1. **Definition**: Precise terminology and scope\n2. **Context**: Historical and theoretical background\n3. **Mechanism**: How it operates or functions\n4. **Examples**: Real-world applications\n5. **Significance**: Why it matters in the field\n\nWould you like me to expand on any specific component?",
            "**Comparative Analysis**:\n\nThis concept differs from similar ideas in several key aspects:\n\n- **Scope**: Broader/narrower application\n- **Methodology**: Different approaches\n- **Outcomes**: Varied results or implications\n- **Theoretical Basis**: Different foundational assumptions\n\nUnderstanding these distinctions is crucial for proper application."
        ];
        
        return this.randomChoice(explanations);
    }

    handleQuickAction(action) {
        let response = '';
        
        switch(action) {
            case 'explain':
                response = "**Concept Explanation Protocol Activated**\n\nI can explain any academic concept. Please specify:\n1. The concept name\n2. Your current understanding level\n3. Desired depth of explanation\n4. Any specific aspects to focus on\n\nExample: 'Explain quantum entanglement at undergraduate level'";
                break;
            case 'problem':
                response = "**Problem Solving Mode**\n\nSubmit your problem for analysis. Include:\n1. Problem statement\n2. Known variables/constraints\n3. Desired outcome\n4. Any attempted solutions\n\nI will provide:\n- Step-by-step solution\n- Alternative approaches\n- Verification methods\n- Related problems for practice";
                break;
            case 'summary':
                response = "**Summary Generation**\n\nProvide the material you'd like summarized. I can:\n1. Extract key points\n2. Identify main arguments\n3. Note important evidence\n4. Highlight connections\n5. Create study outlines\n\nMaximum length: 5000 characters";
                break;
            case 'quiz':
                response = "**Quiz Generation System**\n\nBased on our conversation, here's a practice quiz:\n\n1. **Multiple Choice**: What is the time complexity of binary search?\n   A) O(n) B) O(log n) C) O(n²) D) O(1)\n\n2. **Short Answer**: Explain the concept of recursion.\n\n3. **Problem Solving**: Solve ∫ x² dx from 0 to 3\n\nWould you like more questions or specific topics?";
                break;
        }
        
        this.addMessage(response, 'ai');
        
        if (this.getPreference('voiceResponses')) {
            this.speak(response.split('\n')[0]); // Speak first line
        }
    }

    toggleFocusMode() {
        const container = document.querySelector('.container');
        const focusBtn = document.getElementById('focus-mode');
        
        if (container.classList.contains('focus-active')) {
            container.classList.remove('focus-active');
            focusBtn.innerHTML = '<i class="fas fa-crosshairs"></i><span>Focus Mode</span>';
            this.speak("Focus mode deactivated");
        } else {
            container.classList.add('focus-active');
            focusBtn.innerHTML = '<i class="fas fa-times"></i><span>Exit Focus</span>';
            this.speak("Focus mode activated. Minimizing distractions");
        }
    }

    startStudySession() {
        this.studySession = {
            active: true,
            startTime: new Date(),
            duration: 0,
            topics: [],
            retentionScore: 84
        };
        
        this.updateSessionTimer();
        this.addMessage("Study session initiated. Tracking progress and retention.", 'ai');
    }

    updateStudyMetrics(query) {
        // Update session duration
        if (this.studySession.active) {
            const now = new Date();
            this.studySession.duration = Math.floor((now - this.studySession.startTime) / 1000 / 60);
        }
        
        // Update topics covered
        const topics = this.extractTopics(query);
        topics.forEach(topic => {
            if (!this.studySession.topics.includes(topic)) {
                this.studySession.topics.push(topic);
            }
        });
        
        // Update UI
        this.updateSessionUI();
    }

    extractTopics(query) {
        const academicAreas = [
            'mathematics', 'algebra', 'calculus', 'statistics',
            'programming', 'python', 'javascript', 'algorithms',
            'science', 'physics', 'chemistry', 'biology',
            'literature', 'history', 'philosophy', 'economics'
        ];
        
        return academicAreas.filter(area => query.includes(area));
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Process code blocks
        let processedText = this.processCodeBlocks(text);
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'}
            </div>
            <div class="message-content">
                ${processedText}
                <span class="message-time">${time}</span>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Play notification sound for AI messages
        if (sender === 'ai') {
            const sound = document.getElementById('notification-sound');
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Audio notification:", e));
        }
    }

    processCodeBlocks(text) {
        // Simple code block detection and formatting
        return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code class="language-${lang || 'text'}">${this.escapeHtml(code)}</code></pre>`;
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    speak(text) {
        if (!this.getPreference('voiceResponses')) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        window.speechSynthesis.speak(utterance);
    }

    updateSystemMessage(text) {
        const systemMessage = document.querySelector('.ai-message .message-content p:last-child');
        if (systemMessage) {
            systemMessage.textContent = text;
        }
    }

    updateSystemUI() {
        this.updateSessionUI();
        this.updateStatusIndicators();
    }

    updateSessionUI() {
        // Update session metrics in UI
        const metrics = {
            'focus-timer': this.formatTime(this.studySession.duration),
            'topics-covered': this.studySession.topics.length,
            'retention-score': `${this.studySession.retentionScore}%`
        };
        
        Object.entries(metrics).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    updateStatusIndicators() {
        // Simulate system status changes
        const indicators = ['processing-power', 'knowledge-base', 'memory-usage'];
        indicators.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                const currentWidth = parseInt(element.style.width);
                const newWidth = Math.min(100, Math.max(20, currentWidth + (Math.random() * 10 - 5)));
                element.style.width = `${newWidth}%`;
            }
        });
    }

    startSystemClock() {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            
            const dateString = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            document.getElementById('current-time').textContent = timeString;
            document.getElementById('current-date').textContent = dateString;
        };
        
        updateClock();
        setInterval(updateClock, 1000);
        
        // Update session timer
        setInterval(() => {
            if (this.studySession.active) {
                this.studySession.duration++;
                this.updateSessionUI();
            }
        }, 60000); // Every minute
    }

    updateSessionTimer() {
        setInterval(() => {
            if (this.studySession.active) {
                this.studySession.duration++;
                document.getElementById('focus-timer').textContent = 
                    this.formatTime(this.studySession.duration);
            }
        }, 60000);
    }

    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }

    showSettings() {
        document.getElementById('settings-modal').style.display = 'flex';
    }

    hideSettings() {
        document.getElementById('settings-modal').style.display = 'none';
    }

    saveSettings() {
        this.adaptiveLearning = document.getElementById('adaptive-learning').checked;
        this.responseDepth = parseInt(document.getElementById('detail-level').value);
        
        // Update detail value display
        const detailValue = document.getElementById('detail-value');
        const detailLevels = ['Minimal', 'Basic', 'Balanced', 'Detailed', 'Comprehensive'];
        detailValue.textContent = detailLevels[this.responseDepth - 1];
        
        this.hideSettings();
        this.addMessage("System preferences updated successfully.", 'ai');
    }

    showDocumentation() {
        const docs = `**Athena Documentation**\n\n**Commands**:\n• /explain [topic] - Detailed explanation\n• /solve [problem] - Problem solution\n• /summary [text] - Text summarization\n• /quiz [topic] - Generate quiz\n• /focus - Toggle focus mode\n• /record - Start/stop session recording\n\n**Features**:\n• Adaptive learning algorithms\n• Academic database access\n• Code analysis and debugging\n• Research paper summaries\n• Study progress tracking`;
        
        this.addMessage(docs, 'ai');
    }

    exportData() {
        const exportData = {
            session: this.studySession,
            conversation: this.conversationHistory,
            preferences: {
                adaptiveLearning: this.adaptiveLearning,
                responseDepth: this.responseDepth
            },
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `athena-study-session-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.addMessage("Study session data exported successfully.", 'ai');
    }

    showAnalytics() {
        const analytics = `**Study Analytics**\n\n**Session**: ${this.formatTime(this.studySession.duration)}\n**Topics**: ${this.studySession.topics.length} covered\n**Retention**: ${this.studySession.retentionScore}%\n**Queries**: ${this.conversationHistory.length} total\n**Focus Areas**: ${Array.from(this.knowledgeAreas).join(', ')}\n\n**Recommendations**:\n1. Review topics every 48 hours\n2. Practice active recall\n3. Space repetition for optimal retention`;
        
        this.addMessage(analytics, 'ai');
    }

    setInputType(type) {
        const input = document.getElementById('user-input');
        const buttons = document.querySelectorAll('.option-btn');
        
        buttons.forEach(btn => {
            btn.style.background = btn.dataset.type === type ? 'var(--accent-color)' : 'white';
            btn.style.color = btn.dataset.type === type ? 'white' : 'var(--text-light)';
        });
        
        const placeholders = {
            text: "Enter your study query, problem, or topic for analysis...",
            code: "Enter your code, algorithm, or programming question...",
            math: "Enter mathematical problem, equation, or formula..."
        };
        
        input.placeholder = placeholders[type] || placeholders.text;
    }

    clearCurrentQuery() {
        document.getElementById('user-input').value = '';
    }

    loadUserPreferences() {
        // Load saved preferences from localStorage
        const saved = localStorage.getItem('athenaPreferences');
        if (saved) {
            const prefs = JSON.parse(saved);
            this.adaptiveLearning = prefs.adaptiveLearning || true;
            this.responseDepth = prefs.responseDepth || 3;
            
            // Update UI
            document.getElementById('adaptive-learning').checked = this.adaptiveLearning;
            document.getElementById('detail-level').value = this.responseDepth;
            document.getElementById('detail-value').textContent = 
                ['Minimal', 'Basic', 'Balanced', 'Detailed', 'Comprehensive'][this.responseDepth - 1];
        }
    }

    getPreference(key) {
        const prefs = {
            voiceResponses: true,
            autoSave: true,
            detailedResponses: true
        };
        
        return prefs[key] || true;
    }

    toggleRecording() {
        const btn = document.getElementById('record-session');
        if (btn.innerHTML.includes('Record Session')) {
            btn.innerHTML = '<i class="fas fa-stop-circle"></i><span>Stop Recording</span>';
            this.addMessage("Study session recording started. All interactions will be logged.", 'ai');
        } else {
            btn.innerHTML = '<i class="fas fa-record-vinyl"></i><span>Record Session</span>';
            this.addMessage("Session recording stopped. Data saved to archive.", 'ai');
        }
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

// Helper functions for specific response types
AthenaStudyAI.prototype.generateScienceResponse = function(query) {
    const responses = [
        "**Scientific Analysis**:\n\nBased on established principles:\n1. **Hypothesis**: Testable prediction\n2. **Methodology**: Experimental design\n3. **Data**: Empirical observations\n4. **Analysis**: Statistical evaluation\n5. **Conclusion**: Evidence-based findings\n\n**Peer Review Considerations**: Validity, reliability, reproducibility.",
        "**Research Methodology**:\n\nFor this scientific inquiry:\n- **Control Group**: Essential for comparison\n- **Variables**: Independent vs. dependent\n- **Sample Size**: Power analysis required\n- **Ethics**: IRB approval if human subjects\n- **Publication**: Follow journal guidelines\n\nWould you like the experimental protocol?"
    ];
    
    return this.randomChoice(responses);
};

AthenaStudyAI.prototype.generateLiteratureResponse = function(query) {
    const responses = [
        "**Literary Analysis Framework**:\n\n1. **Textual Analysis**: Close reading of passages\n2. **Historical Context**: Author's time period\n3. **Theoretical Lens**: Critical theory application\n4. **Character Development**: Arc and motivation\n5. **Thematic Elements**: Recurring patterns\n6. **Stylistic Devices**: Literary techniques employed\n\n**Thesis Development**: Construct argument with textual evidence.",
        "**Critical Interpretation**:\n\nKey aspects for analysis:\n- **Narrative Structure**: Linear vs. nonlinear\n- **Point of View**: First, second, or third person\n- **Symbolism**: Objects representing ideas\n- **Irony**: Verbal, situational, dramatic\n- **Allusion**: References to other works\n- **Diction**: Word choice and connotation\n\nProvide specific text for detailed analysis."
    ];
    
    return this.randomChoice(responses);
};

AthenaStudyAI.prototype.generateProcedure = function(query) {
    return "**Procedural Guidelines**:\n\nStep-by-step methodology:\n\n1. **Preparation**: Gather required materials/resources\n2. **Initialization**: Set up environment/conditions\n3. **Execution**: Perform core procedure\n4. **Monitoring**: Track progress/metrics\n5. **Adjustment**: Make necessary modifications\n6. **Completion**: Finalize and document\n7. **Verification**: Validate results\n8. **Cleanup**: Restore original state\n\n**Safety Protocols**: Always follow established guidelines.";
};

AthenaStudyAI.prototype.generateComparison = function(query) {
    return "**Comparative Analysis**:\n\n| Aspect | Item A | Item B |\n|--------|--------|--------|\n| **Definition** | [Define A] | [Define B] |\n| **Purpose** | [Purpose A] | [Purpose B] |\n| **Method** | [Method A] | [Method B] |\n| **Advantages** | [Pros A] | [Pros B] |\n| **Limitations** | [Cons A] | [Cons B] |\n| **Use Cases** | [When to use A] | [When to use B] |\n\n**Key Distinction**: [Main difference]";
};

AthenaStudyAI.prototype.generateExample = function(query) {
    const examples = [
        "**Practical Example**:\n\n**Scenario**: Real-world application\n**Context**: Relevant circumstances\n**Implementation**: Step-by-step application\n**Result**: Expected outcome\n**Analysis**: Why this demonstrates the concept\n**Variations**: Alternative scenarios\n\n**Learning Objective**: Understand through applied context.",
        "**Case Study Example**:\n\n1. **Background**: Historical/contextual information\n2. **Problem Statement**: Specific issue addressed\n3. **Approach**: Methodology employed\n4. **Implementation**: How it was executed\n5. **Results**: Outcomes achieved\n6. **Analysis**: Lessons learned\n7. **Application**: How to apply elsewhere"
    ];
    
    return this.randomChoice(examples);
};

// Initialize Athena when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.athena = new AthenaStudyAI();
    
    // Initialize Prism for code highlighting
    if (window.Prism) {
        Prism.highlightAll();
    }
});
