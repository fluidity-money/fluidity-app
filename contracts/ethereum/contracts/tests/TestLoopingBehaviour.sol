// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

contract TestLoopingBehaviour {
    uint8[] public items;

    constructor(uint8[] memory _items) {
        for (uint i = 0; i < _items.length; ++i)
            items[i] = _items[i];
    }

    function _popItem(uint _i) internal {
        items[_i] = items[items.length - 1];
        items.pop();
    }

    function test() public {
        for (uint i = items.length - 1; i > 0; --i) {
            if (items[i] == 1) {
                _popItem(i);
            }
        }
    }
}
