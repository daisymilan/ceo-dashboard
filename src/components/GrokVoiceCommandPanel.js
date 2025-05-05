import React, { useState } from 'react';
import { FaMicrophone, FaStop, FaTimes } from 'react-icons/fa';
import { processVoiceCommand } from '../api/grok';
import '../styles/GrokVoiceCommandPanel.css';

const GrokVoiceCommandPanel = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Toggle listening state
  const toggleListening = async () => {
    if (isListening) {
      // Stop listening logic
      setIsListening(false);
      
      if (transcript) {
        // Process command with Grok API
        setIsProcessing(true);
        try {
          const result = await processVoiceCommand(transcript);
          setResponse(result.response.text);
        } catch (error) {
          setResponse("Sorry, I couldn't process that command.");
          console.error('Error processing command:', error);
        } finally {
          setIsProcessing(false);
        }
      }
    } else {
      // Start listening logic
      setIsListening(true);
      setTranscript('');
      setResponse('');
      
      // Mock voice recognition (in a real implementation, use Web Speech API or similar)
      // This is just a simulation for the prototype
      const mockRecognition = setTimeout(() => {
        setTranscript('Summarize today\'s sales performance');
        setIsListening(false);
        
        // Simulate processing
        setIsProcessing(true);
        setTimeout(() => {
          setResponse('Today\'s sales are up 12% compared to yesterday, with $24,500 in total revenue. The "Duality" fragrance is your top performer today with 8 units sold.');
          setIsProcessing(false);
        }, 1500);
      }, 3000);
      
      return () => clearTimeout(mockRecognition);
    }
  };

  // In a real implementation, integrate with the Web Speech API
  // This would be something like:
  /*
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      setIsListening(false);
      processCommandWithGrok(transcript);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.start();
    setIsListening(true);
  };
  */

  return (
    <>
      <button 
        className="voice-command-button"
        onClick={() => setShowPanel(!showPanel)}
        title="Grok Voice Assistant"
      >
        <FaMicrophone />
      </button>
      
      {showPanel && (
        <div className="voice-command-panel">
          <div className="panel-header">
            <h3>Grok Voice Assistant</h3>
            <button className="close-btn" onClick={() => setShowPanel(false)}>
              <FaTimes />
            </button>
          </div>
          
          <div className="voice-interface">
            <div className="transcript-area">
              {transcript ? transcript : isListening ? 'Listening...' : 'Press the microphone to speak'}
            </div>
            
            {isProcessing && (
              <div className="processing-indicator">
                <div className="processing-spinner"></div>
                <span>Processing your request...</span>
              </div>
            )}
            
            {response && (
              <div className="response-area">
                <div className="ai-bubble">
                  <p>{response}</p>
                </div>
              </div>
            )}
            
            <button 
              className={`voice-button ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              disabled={isProcessing}
            >
              {isListening ? <FaStop /> : <FaMicrophone />}
            </button>
            
            <div className="command-suggestions">
              <p>Try saying:</p>
              <ul>
                <li>"Summarize today's sales"</li>
                <li>"Show inventory levels in Dubai"</li>
                <li>"What's our Instagram engagement this week?"</li>
                <li>"Schedule a reminder for the investor meeting"</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GrokVoiceCommandPanel;