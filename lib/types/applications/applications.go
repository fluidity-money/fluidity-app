// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package applications

import "fmt"

// applications contains types relevant to supporting events generated
// via interaction with external applications

// Enum that represents supported applications on Ethereum, used to obtain
// application-specific information like fees and senders/recipients.
type Application int64

var applicationNames = []string{
    "none",
    "uniswap_v2",
    "balancer_v2",
    "oneinch_v2",
    "oneinch_v1",
    "mooniswap",
    "oneinch_fixedrate",
    "dodo_v2",
    "curve",
    "multichain",
    "xy_finance",
}

func (app Application) String() string {
	return applicationNames[app]
}

func ParseApplicationName(name string) (Application, error) {
    for i, app := range applicationNames {
        if app == name {
            return Application(i), nil
        }
    }

    return 0, fmt.Errorf(
        "unknown app name %s",
        name,
    )
}
