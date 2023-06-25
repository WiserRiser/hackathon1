pragma solidity 0.8.17;

contract Counter {
    uint256 public counter;

    event IncrementCounter(uint256 newCounterValue, address msgSender);

    // `increment` is the target function to call.
    // This function increments a counter variable by 1
    // IMPORTANT: with `sponsoredCall` you need to implement
    // your own smart contract security measures, as this
    // function can be called by any third party and not only by
    // Gelato Relay. If not done properly, funds kept in this
    // smart contract can be stolen.
    function increment() external {
        counter++;
        emit IncrementCounter(counter, msg.sender);
    }
}