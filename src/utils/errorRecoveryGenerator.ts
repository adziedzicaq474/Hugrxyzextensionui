export interface ErrorDetail {
  step: string;
  error: string;
  timestamp: string;
}

export interface SolutionCard {
  id: string;
  title: string;
  description: string;
  action: 'retry' | 'edit' | 'debug';
}

export function generateMockError(): ErrorDetail {
  return {
    step: 'Step 2: Check Balance',
    error: 'Failed to fetch wallet balance. Network timeout after 30s. The RPC endpoint might be overloaded or unreachable.',
    timestamp: new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
    }),
  };
}

export function generateMockSolutions(): SolutionCard[] {
  return [
    {
      id: 'retry',
      title: 'Retry Test',
      description: 'Run the test again. Network issues are often temporary and may resolve on retry.',
      action: 'retry',
    },
    {
      id: 'edit',
      title: 'Edit Variables',
      description: 'Adjust timeout duration or switch to a different RPC endpoint for better reliability.',
      action: 'edit',
    },
    {
      id: 'debug',
      title: 'View Logs',
      description: 'Check detailed execution logs to identify the root cause of the failure.',
      action: 'debug',
    },
  ];
}
