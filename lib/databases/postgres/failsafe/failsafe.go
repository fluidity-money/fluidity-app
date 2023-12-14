// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package failsafe

// Context to use for when failsafe acquisition goes wrong
const Context = "POSTGRES/FAILSAFE"

// TableFailsafeTransactionHashLogIndex to be used as the final check before
// a side effectful action where duplication could possibly happen at the
// infra level
const TableFailsafeTransactionHashLogIndex = "failsafe_transaction_hash_log_index"
