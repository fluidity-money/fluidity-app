// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package applications

// applications contains types relevant to supporting events generated
// via interaction with external applications

// Enum that represents supported applications on Ethereum, used to obtain
// application-specific information like fees and senders/recipients.
type Application int64
