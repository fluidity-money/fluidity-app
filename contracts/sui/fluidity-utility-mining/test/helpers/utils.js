const { MIST_PER_SUI } = require('@mysten/sui.js/utils');

const suiBalance = (balance) => {
    return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
};

function extractTransactionStatusAndError(executeTxn) {
  const transactionStatus = executeTxn.effects.status.status; // 'success' or 'failure'
  const errorMessage = transactionStatus === 'failure' ? executeTxn.effects.status.error : undefined;

  console.log(`Transaction Status: ${transactionStatus}`);
  if (errorMessage) {
    console.log(`Error Message: ${errorMessage}`);
  } 
}

module.exports = { suiBalance, extractTransactionStatusAndError };
