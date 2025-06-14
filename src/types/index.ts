
export interface Notification {
  id: string;
  type: 'alert' | 'trade' | 'info' | 'update';
  title: string;
  message: string;
  time: string;
  read?: boolean;
}

export interface ActivePosition {
  id: string;
  ticker: string;
  quantity: number;
  purchasePrice: number;
  currentMockPrice: number;
  targetPrice?: number | null;
  stopLossPrice?: number | null;
  mode: 'autopilot' | 'manual';
  purchaseDate: string; // ISO string
}

export interface PortfolioPosition extends ActivePosition {
  currentValue: number;
  totalInvested: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface PortfolioSummary {
  currentPortfolioValue: number;
  totalInvested: number;
  overallProfitLoss: number;
  overallProfitLossPercentage: number;
}

export interface DonutChartData {
  name: string;
  value: number;
  fill: string;
}
