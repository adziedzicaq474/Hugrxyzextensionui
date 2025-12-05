// Scenario Generator
// Analyzes recorded flow and generates all possible execution paths

interface ActionBlock {
  id: string;
  name: string;
  nodeType?: 'interaction' | 'conditional' | 'while' | 'for';
  condition?: any;
  yesPath?: any;
  noPath?: any;
}

interface TestScenario {
  id: string;
  name: string;
  description: string;
  type: 'happy-path' | 'edge-case' | 'conditional';
  conditions?: {
    blockName: string;
    condition: string;
    result: boolean;
  }[];
  estimatedSteps: number;
  coveragePercentage?: number;
  executionPath?: string[]; // Block IDs in execution order
}

/**
 * Generate all possible test scenarios from a recorded flow
 */
export function generateTestScenarios(blocks: ActionBlock[]): TestScenario[] {
  const scenarios: TestScenario[] = [];

  // 1. Main path (all conditionals = true, no loops)
  scenarios.push(generateMainPathScenario(blocks));

  // 2. Generate scenarios for each conditional block
  const conditionalBlocks = blocks.filter(b => b.nodeType === 'conditional');
  conditionalBlocks.forEach(block => {
    scenarios.push(generateConditionalYesScenario(blocks, block));
    scenarios.push(generateConditionalNoScenario(blocks, block));
  });

  // 3. Generate loop scenarios
  const loopBlocks = blocks.filter(b => b.nodeType === 'while' || b.nodeType === 'for');
  loopBlocks.forEach(block => {
    scenarios.push(generateLoopScenario(blocks, block));
  });

  // Calculate coverage
  const totalPaths = scenarios.length;
  scenarios.forEach((scenario, index) => {
    scenario.coveragePercentage = Math.round(((index + 1) / totalPaths) * 100);
  });

  return scenarios;
}

/**
 * Main path: Execute all blocks sequentially, conditionals default to TRUE
 */
function generateMainPathScenario(blocks: ActionBlock[]): TestScenario {
  const executionPath = blocks.map(b => b.id);
  const conditionalBlocks = blocks.filter(b => b.nodeType === 'conditional');
  
  const conditions = conditionalBlocks.map(block => ({
    blockName: block.name,
    condition: 'Default condition',
    result: true,
  }));

  return {
    id: 'scenario-main',
    name: 'Main Path',
    description: 'Execute all steps with default conditions',
    type: 'happy-path',
    conditions: conditions.length > 0 ? conditions : undefined,
    estimatedSteps: blocks.length,
    coveragePercentage: 0, // Will be calculated
    executionPath,
  };
}

/**
 * Conditional YES path: Test when a specific condition is TRUE
 */
function generateConditionalYesScenario(
  blocks: ActionBlock[],
  conditionalBlock: ActionBlock
): TestScenario {
  const executionPath: string[] = [];
  
  // Add blocks before conditional
  const blockIndex = blocks.findIndex(b => b.id === conditionalBlock.id);
  for (let i = 0; i <= blockIndex; i++) {
    executionPath.push(blocks[i].id);
  }
  
  // Add YES path blocks (mock)
  executionPath.push(`${conditionalBlock.id}-yes-1`);
  executionPath.push(`${conditionalBlock.id}-yes-2`);
  
  // Add remaining blocks
  for (let i = blockIndex + 1; i < blocks.length; i++) {
    executionPath.push(blocks[i].id);
  }

  return {
    id: `scenario-${conditionalBlock.id}-yes`,
    name: `${conditionalBlock.name} - YES Branch`,
    description: `Test when ${conditionalBlock.name} condition is TRUE`,
    type: 'conditional',
    conditions: [
      {
        blockName: conditionalBlock.name,
        condition: 'balance >= 0.1 ETH',
        result: true,
      },
    ],
    estimatedSteps: executionPath.length,
    coveragePercentage: 0,
    executionPath,
  };
}

/**
 * Conditional NO path: Test when a specific condition is FALSE
 */
function generateConditionalNoScenario(
  blocks: ActionBlock[],
  conditionalBlock: ActionBlock
): TestScenario {
  const executionPath: string[] = [];
  
  // Add blocks before conditional
  const blockIndex = blocks.findIndex(b => b.id === conditionalBlock.id);
  for (let i = 0; i <= blockIndex; i++) {
    executionPath.push(blocks[i].id);
  }
  
  // Add NO path blocks (mock)
  executionPath.push(`${conditionalBlock.id}-no-1`);
  
  // Add remaining blocks
  for (let i = blockIndex + 1; i < blocks.length; i++) {
    executionPath.push(blocks[i].id);
  }

  return {
    id: `scenario-${conditionalBlock.id}-no`,
    name: `${conditionalBlock.name} - NO Branch`,
    description: `Test when ${conditionalBlock.name} condition is FALSE`,
    type: 'conditional',
    conditions: [
      {
        blockName: conditionalBlock.name,
        condition: 'balance >= 0.1 ETH',
        result: false,
      },
    ],
    estimatedSteps: executionPath.length,
    coveragePercentage: 0,
    executionPath,
  };
}

/**
 * Loop scenario: Test loop execution
 */
function generateLoopScenario(
  blocks: ActionBlock[],
  loopBlock: ActionBlock
): TestScenario {
  const executionPath: string[] = [];
  
  // Add blocks before loop
  const blockIndex = blocks.findIndex(b => b.id === loopBlock.id);
  for (let i = 0; i <= blockIndex; i++) {
    executionPath.push(blocks[i].id);
  }
  
  // Add loop iterations (mock 3 iterations)
  for (let iteration = 1; iteration <= 3; iteration++) {
    executionPath.push(`${loopBlock.id}-iter-${iteration}`);
  }
  
  // Add remaining blocks
  for (let i = blockIndex + 1; i < blocks.length; i++) {
    executionPath.push(blocks[i].id);
  }

  return {
    id: `scenario-${loopBlock.id}-loop`,
    name: `${loopBlock.name} - Loop Path`,
    description: `Test ${loopBlock.name} with multiple iterations`,
    type: 'edge-case',
    conditions: [
      {
        blockName: loopBlock.name,
        condition: 'attempts < 3',
        result: true,
      },
    ],
    estimatedSteps: executionPath.length,
    coveragePercentage: 0,
    executionPath,
  };
}

/**
 * Mock: Generate sample scenarios for demo
 */
export function generateMockScenarios(): TestScenario[] {
  return [
    {
      id: 'scenario-1',
      name: 'Standard Execution',
      description: 'All conditions met, swap executes successfully',
      type: 'happy-path',
      conditions: [
        {
          blockName: 'Check Balance',
          condition: 'balance >= 0.1 ETH',
          result: true,
        },
      ],
      estimatedSteps: 5,
      coveragePercentage: 33,
      executionPath: ['1', '2', '3', '4', '5'],
    },
    {
      id: 'scenario-2',
      name: 'High Slippage',
      description: 'Swap executed with higher than expected slippage tolerance',
      type: 'edge-case',
      conditions: [
        {
          blockName: 'Check Slippage',
          condition: 'slippage <= 2%',
          result: false,
        },
      ],
      estimatedSteps: 6,
      coveragePercentage: 33,
      executionPath: ['1', '2', '3', '4', '4', '5'],
    },
    {
      id: 'scenario-3',
      name: 'Low Balance',
      description: 'Insufficient balance triggers alternative flow',
      type: 'conditional',
      conditions: [
        {
          blockName: 'Check Balance',
          condition: 'balance >= 0.1 ETH',
          result: false,
        },
      ],
      estimatedSteps: 3,
      coveragePercentage: 34,
      executionPath: ['1', '2', '5'],
    },
  ];
}