// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

contract TestLoopingBehaviour {
    uint8[] private items;

    constructor(uint8[] memory _items) {
        for (uint i = 0; i < _items.length; ++i)
            items.push(_items[i]);
    }

    function _popItem(uint _i) internal {
        items[_i] = items[items.length - 1];
        items.pop();
    }

    function getItems() public view returns (uint8[] memory) {
    	return items;
    }

    function test() public {
        for (uint i = items.length; i > 0;) {
            --i;

            if (items[i] == 1) {
                _popItem(i);
            }
        }
    }
}
