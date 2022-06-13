// https://docs.near.org/docs/concepts/account#account-id-rules / https://nomicon.io/DataStructures/Account
// minimum length is 2, maximum length is 64, and then also enforce these rules:
// See https://stackoverflow.com/q/72537015/470749
/* Currently the validation rules allow uppercase characters, which are technically not allowed, so we need to convert 
to lowercase during form submission after validation (see `postForm`). */
export const testnetRegex = /^(([A-Za-z\d]+[-_])*[A-Za-z\d]+\.)*testnet$/;
export const mainnetRegex = /^(([A-Za-z\d]+[-_])*[A-Za-z\d]+\.)*near$/;

// https://github.com/near/near-wallet/blob/40512df4d14366e1b8e05152fbf5a898812ebd2b/packages/frontend/src/utils/account.js#L8
// https://github.com/near/near-wallet/blob/40512df4d14366e1b8e05152fbf5a898812ebd2b/packages/frontend/src/components/accounts/AccountFormAccountId.js#L95
// https://github.com/near/near-cli/blob/cdc571b1625a26bcc39b3d8db68a2f82b91f06ea/commands/create-account.js#L75
