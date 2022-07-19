use solana_client::{rpc_client::RpcClient, rpc_request::RpcError};
use solana_sdk::transaction::Transaction;

pub fn send_txn(client: &RpcClient, txn: Transaction) -> Result<Vec<String>, String> {
    match client.send_and_confirm_transaction(&txn) {
        Ok(sig) => {
            if let Ok(t) = client.get_transaction(
                &sig,
                solana_transaction_status::UiTransactionEncoding::JsonParsed,
            ) {
                if let Some(meta) = t.transaction.meta {
                    if let Some(logs) = meta.log_messages {
                        Ok(logs)
                    } else {
                        Err("no logs".to_string())
                    }
                } else {
                    Err("no meta".to_string())
                }
            } else {
                Err("Couldn't get transaction".to_string())
            }
        }
        Err(e) => {
            if let solana_client::client_error::ClientErrorKind::RpcError(rpc_err) = e.kind {
                match rpc_err {
                    RpcError::RpcResponseError{code: _, message, data} =>
                        Err(format!("Failed to send txn (RPC Error): {}{}", message, match data {
                            solana_client::rpc_request::RpcResponseErrorData::SendTransactionPreflightFailure(res) =>
                                match res.logs {
                                    Some(logs) => format!("\nLogs: {:#?}", logs),
                                    _ => "".to_string(),
                                }
                            _ => "".to_string(),
                        })),
                    RpcError::RpcRequestError(msg)|RpcError::ParseError(msg)|RpcError::ForUser(msg) =>
                        Err(format!("Failed to send txn (RPC Error): {}", msg)),
                }
            } else {
                Err(format!("Failed to send txn: {}", e))
            }
        }
    }
}
