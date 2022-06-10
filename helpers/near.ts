// https://docs.near.org/docs/concepts/account#account-id-rules / https://nomicon.io/DataStructures/Account
// minimum length is 2, maximum length is 64, and then also enforce these rules:
// TODO: Figure out the official validation rules for testnet and mainnet. See https://stackoverflow.com/q/72537015/470749
export const testnetRegex = /^(\w|(?<!\.)\.)+(?<!\.)\.(testnet)$/;
export const mainnetRegex = /^$|\.near$/; // Is empty or ends with .near. https://stackoverflow.com/a/3333525/470749

// https://github.com/near/near-wallet/blob/40512df4d14366e1b8e05152fbf5a898812ebd2b/packages/frontend/src/utils/account.js#L8
// https://github.com/near/near-wallet/blob/40512df4d14366e1b8e05152fbf5a898812ebd2b/packages/frontend/src/components/accounts/AccountFormAccountId.js#L95
// https://github.com/near/near-cli/blob/cdc571b1625a26bcc39b3d8db68a2f82b91f06ea/commands/create-account.js#L75
