import { BasicRecordingScreen } from './BasicRecordingScreen';
import { ConditionalSetupScreen } from './conditional-v2/ConditionalSetupScreen';
import { WhileRecordingFlow } from './WhileRecordingFlow';
import { ForRecordingFlow } from './ForRecordingFlow';

interface Variable {
  key: string;
  value: string;
  type: 'preset' | 'from_step' | 'capture';
  fromStep?: number;
  description?: string;
}

interface LogicCondition {
  condition: string;
  ifTrue: string;
  ifFalse: string;
}

interface PathConfig {
  blocks: string[];  // Block IDs for this path (pre-configured by AI)
}

interface ActionBlock {
  id: string;
  name: string;
  goal: string;
  logic?: LogicCondition[];
  variables: Variable[];
  nodeType?: 'interaction' | 'conditional' | 'while' | 'for';
  paths?: {
    yes?: PathConfig;
    no?: PathConfig;
  };
}

interface RecordingScreenProps {
  actionBlock: ActionBlock;
  currentIndex: number;
  totalBlocks: number;
  availableBlocks?: ActionBlock[];  // Optional: blocks available for conditional paths
  onBack: () => void;
  onComplete: () => void;
}

export function RecordingScreen(props: RecordingScreenProps) {
  const { actionBlock, availableBlocks = [] } = props;
  const nodeType = actionBlock.nodeType || 'interaction';

  // Route to appropriate recording flow based on node type
  switch (nodeType) {
    case 'conditional':
      return <ConditionalSetupScreen {...props} availableBlocks={availableBlocks} />;
    
    case 'while':
      return <WhileRecordingFlow {...props} />;
    
    case 'for':
      return <ForRecordingFlow {...props} />;
    
    case 'interaction':
    default:
      return <BasicRecordingScreen {...props} />;
  }
}