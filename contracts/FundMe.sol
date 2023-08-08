// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "./PriceConverter.sol";

error FundMe__NotOwner();

/** @title A contract for crowd funding
    @author Kaleab A
    @notice This contract is to demo a sample funding contract
    @dev This implements the price feeds as our library
 */


contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;  

    // State Variables
    mapping(address => uint256) private addressToAmountFunded;
    address[] private funders;

    uint256 private constant MINIMUM_USD = 10 * 1e18;
    address private immutable i_owner;

    AggregatorV3Interface private priceFeed;

    modifier onlyOwner{
        if(msg.sender != i_owner){
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress){
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable{
        //console.log(msg.value.getConversionRate(priceFeed));
        require(msg.value.getConversionRate(priceFeed) == MINIMUM_USD,"Didn't send enough");
       // require(1==2,"are you for real");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }


    function withdraw() public onlyOwner{
        for(uint256 funderIndex=0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);

        // transfer
        //payable(msg.sender).transfer(address(this).balance);
        // send
        //bool sendSuccess = payable(msg.sender).send(address(this).balance);
        //require(sendSuccess,"Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess,"Send failed");
    }
   function cheaperWithdraw() public payable onlyOwner() {
        address[] memory fundersx = funders;
        for(uint256 funderIndex = 0; funderIndex < fundersx.length; funderIndex++){
            address funder = fundersx[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);

        // transfer
        //payable(msg.sender).transfer(address(this).balance);
        // send
        //bool sendSuccess = payable(msg.sender).send(address(this).balance);
        //require(sendSuccess,"Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess,"Send failed");
   }

    function getOwner() public view returns (address){
        return i_owner;
    }
    function getFunder(uint256 index) public view returns(address){
        return funders[index];
    }
    function getAddressToAmountFunded(address funder) public view returns (uint256){
        return addressToAmountFunded[funder];
    }
    function getPricedFeed() public view returns (AggregatorV3Interface){
        return priceFeed;
    }

}