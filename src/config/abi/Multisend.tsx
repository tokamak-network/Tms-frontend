export const MULTISEND_INTERFACE = [
  {
    inputs: [],
    name: 'InvalidInitialization',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NotInitializing',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'version',
        type: 'uint64'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'recipients',
        type: 'address[]'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]'
      }
    ],
    name: 'SendERC20',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: 'recipients',
        type: 'address[]'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]'
      }
    ],
    name: 'SendETH',
    type: 'event'
  },
  {
    inputs: [],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address'
      },
      {
        internalType: 'address[]',
        name: '_recipients',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: '_amounts',
        type: 'uint256[]'
      }
    ],
    name: 'sendERC20',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_recipients',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: '_amounts',
        type: 'uint256[]'
      }
    ],
    name: 'sendETH',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
];
