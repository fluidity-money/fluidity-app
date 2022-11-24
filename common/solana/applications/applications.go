// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package applications

import "fmt"

// Application supported by the Solana application server
type Application int64

const (
	// ApplicationSpl is the default application, representing a transfer
	ApplicationSpl Application = iota
	ApplicationSaber
	ApplicationOrca
	ApplicationRaydium
	ApplicationAldrinV1
	ApplicationAldrinV2
	ApplicationLifinity
	ApplicationMercurial
)

// applicationNames is used to map human readable names to their enum varients
var applicationNames = []string{
	"spl",
	"saber",
	"orca",
	"raydium",
	"aldrinv1",
	"aldrinv2",
	"lifinity",
	"mercurial",
}

func (app Application) String() string {
	return applicationNames[app]
}

// ParseApplication based on the name given
func ParseApplicationName(name string) (*Application, error) {
    for i, app := range applicationNames {
        if app == name {
			application_ := Application(i)
			return &application_, nil
        }
    }

    return nil, fmt.Errorf(
        "unknown app name %s",
        name,
    )
}
