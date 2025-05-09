import React from 'react';

const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
      <p className="font-bold">Important Disclaimer (MVP)</p>
      <p>
        This platform is an MVP (Minimum Viable Product) for demonstration and educational purposes only.
        All market data (BTC/USD prices, X posts) is **simulated**.
        AI-generated insights and trade ideas are based on simple, predefined rules and are **not financial advice**.
        Trading cryptocurrencies involves significant risk of loss. Always do your own research (DYOR) and consult with a qualified financial advisor before making any investment decisions.
        Use this platform at your own risk.
      </p>
    </div>
  );
};

export default DisclaimerBanner;