// n8n.js - Interface for n8n workflows

/**
 * Configuration for n8n API
 */
const N8N_CONFIG = {
  baseUrl: process.env.REACT_APP_N8N_BASE_URL || 'http://localhost:5678',
  apiKey: process.env.REACT_APP_N8N_API_KEY || '',
  webhookBaseUrl: process.env.REACT_APP_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/'
};

/**
 * Execute an n8n workflow by name
 * 
 * @param {string} workflowName - The name of the workflow to execute
 * @param {Object} parameters - Parameters to pass to the workflow
 * @returns {Promise<Object>} - The workflow execution result
 */
export const executeN8nWorkflow = async (workflowName, parameters = {}) => {
  // In a real implementation, this would make an API call to the n8n instance
  // For the prototype, we'll simulate the response
  console.log(`Executing n8n workflow: ${workflowName} with parameters:`, parameters);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'success',
        workflowName,
        executionId: `exec-${Math.random().toString(36).substr(2, 9)}`,
        data: {}  // This would be the actual workflow result in production
      });
    }, 1000);
  });
};

/**
 * Creates a webhook URL for an n8n workflow
 * 
 * @param {string} workflowId - The ID of the workflow
 * @returns {string} - The webhook URL
 */
export const createWebhookUrl = (workflowId) => {
  return `${N8N_CONFIG.webhookBaseUrl}${workflowId}`;
};

/**
 * Fetches all available workflows from n8n
 * 
 * @returns {Promise<Array>} - List of workflows
 */
export const fetchWorkflows = async () => {
  // In a real implementation, this would fetch workflows from the n8n API
  // For the prototype, we'll return mock data
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'wf001',
          name: 'woocommerce-sales-data',
          active: true,
          createdAt: '2025-04-15T10:30:00Z'
        },
        {
          id: 'wf002',
          name: 'woocommerce-inventory',
          active: true,
          createdAt: '2025-04-16T14:20:00Z'
        },
        {
          id: 'wf003',
          name: 'woocommerce-products',
          active: true,
          createdAt: '2025-04-16T15:45:00Z'
        },
        {
          id: 'wf004',
          name: 'woocommerce-orders',
          active: true,
          createdAt: '2025-04-17T09:15:00Z'
        },
        {
          id: 'wf005',
          name: 'grok-integration',
          active: true,
          createdAt: '2025-04-18T11:30:00Z'
        },
        {
          id: 'wf006',
          name: 'social-media-metrics',
          active: true,
          createdAt: '2025-04-19T13:45:00Z'
        }
      ]);
    }, 800);
  });
};

/**
 * Checks the status of an n8n workflow execution
 * 
 * @param {string} executionId - The ID of the execution to check
 * @returns {Promise<Object>} - The execution status
 */
export const checkExecutionStatus = async (executionId) => {
  // In a real implementation, this would check the status via the n8n API
  // For the prototype, we'll simulate a successful execution
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        executionId,
        status: 'success',
        startedAt: new Date(Date.now() - 5000).toISOString(),
        finishedAt: new Date().toISOString(),
        executionTime: 5000 // milliseconds
      });
    }, 500);
  });
};

/**
 * Activates or deactivates an n8n workflow
 * 
 * @param {string} workflowId - The ID of the workflow
 * @param {boolean} active - Whether to activate or deactivate the workflow
 * @returns {Promise<Object>} - The updated workflow
 */
export const toggleWorkflowActive = async (workflowId, active) => {
  // In a real implementation, this would activate/deactivate via the n8n API
  console.log(`${active ? 'Activating' : 'Deactivating'} workflow: ${workflowId}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: workflowId,
        active,
        updatedAt: new Date().toISOString()
      });
    }, 700);
  });
};