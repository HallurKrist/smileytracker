//transactions, blocks, transaction output in block


/**
 * 
 * @param {String} txid 
 * @returns -1 if anything went wrong, JSON of transaction else
 */
export async function fetchTransaction(txid) {
    let json;
    const url = "https://blocks.smileyco.in/api/tx/" + txid;

    try {
        const result = await fetch(url);
        if (!result.ok) {
          throw new Error('result not ok');
        }
        json = await result.json();
    } catch (e) {
        return -1;
    } finally {
        return json;
    }
}

/**
 * 
 * @param {String} blockHash 
 * @returns -1 if anything went wrong, JSON of block else
 */
export async function fetchBlock(blockHash) {
    let json;
    const url = "https://blocks.smileyco.in/api/block/" + blockHash;

    try {
        const result = await fetch(url);
        if (!result.ok) {
          throw new Error('result not ok');
        }
        json = await result.json();
    } catch (e) {
        return -1;
    } finally {
        return json;
    }
}

/**
 * 
 * @param {TxId for the output transaction} txidOut 
 * @param {vout for output transaction} vout 
 * @param {block hash for block that is bwing searched in} blockHash 
 * @returns -1 if not in or error, else txid for that transaction
 */
export async function txidOutputInBlock(txidOut, vout, blockHash) {
    const block = await fetchBlock(blockHash);
    if (block === -1) return -1;

    const txids = block?.tx;
    for (let i = 0; i < txids.length; i++) {
        let result = await isTxidOutputInTransaction(txidOut, vout, txids[i]);

        if (result) return txids[i];
    }

    return -1
}

/**
 * 
 * @param {TxId for the output transaction} txidOut 
 * @param {vout for output transaction} vout 
 * @param {TxId for the transaction being searched in} txidIn 
 * @returns false if not in, true else
 */
export async function isTxidOutputInTransaction(txidOut, vout, txidIn) {
    const transaction = await fetchTransaction(txidIn);
    if (transaction === -1) return false;

    const vin = transaction?.vin;
    for (let i = 0; i < vin.length; i ++) {
        if (vin[i]?.txid === txidOut && vin[i]?.vout === vout) {
            return true;
        }
    }

    return false;
}